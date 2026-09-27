import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  FileText, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Eye, 
  UserCheck, 
  GraduationCap, 
  Building2, 
  BookOpen, 
  Search, 
  Filter, 
  Check, 
  X,
  RotateCcw,
  Briefcase,
  Code2,
  FlaskConical,
  Globe2,
  Mail,
  Phone,
  FileCheck2,
  Sparkles,
  ArrowRight,
  UserX
} from 'lucide-react';
import { 
  VerificationRequest, 
  UserRole, 
  RegistrationRequest, 
  DocumentType
} from '../../types';
import { 
  UserProfile,
  loadRegistrationRequests, 
  approveRegistrationRequest,
  rejectRegistrationRequest,
  requestChangesForRegistration,
  loadUsers,
  verifyUserIdentity,
  rejectUserVerification,
  loadVerificationRequests
} from '../../lib/authService';

interface StudentVerificationManagerProps {
  reviewerName?: string;
  reviewerRole?: UserRole;
  onNotification?: (msg: string) => void;
}

export const StudentVerificationManager: React.FC<StudentVerificationManagerProps> = ({
  reviewerName,
  reviewerRole = 'FACULTY',
  onNotification
}) => {
  const effectiveReviewerName = reviewerName || (
    reviewerRole === 'HOD' ? 'Dr. Rajesh Kumar (HOD Reviewer)' :
    reviewerRole === 'FACULTY' ? 'Dr. Anil Sharma (Faculty Reviewer)' :
    'Institutional Administrator'
  );
  const currentRole: UserRole = (reviewerRole as UserRole) || 'FACULTY';

  // Active Stage Tab
  // Stage 1: Registration Requests Queue
  // Stage 2: Role Document Verification Queue
  const [activeQueue, setActiveQueue] = useState<'REGISTRATION_REQUESTS' | 'ROLE_VERIFICATION'>('REGISTRATION_REQUESTS');

  // Stage 1: Registration Requests State
  const [regRequests, setRegRequests] = useState<RegistrationRequest[]>([]);
  const [regFilterStatus, setRegFilterStatus] = useState<string>('ALL');
  const [regFilterRole, setRegFilterRole] = useState<string>('ALL');
  const [regSearchTerm, setRegSearchTerm] = useState('');

  // Stage 2: Role Verifications State
  const [usersList, setUsersList] = useState<UserProfile[]>([]);
  const [verFilterStatus, setVerFilterStatus] = useState<string>('ALL');
  const [verFilterRole, setVerFilterRole] = useState<string>('ALL');
  const [verSearchTerm, setVerSearchTerm] = useState('');

  // Modals & Action States
  const [inspectingReg, setInspectingReg] = useState<RegistrationRequest | null>(null);
  const [inspectingUser, setInspectingUser] = useState<UserProfile | null>(null);
  const [rejectingReg, setRejectingReg] = useState<RegistrationRequest | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [requestingChangesReg, setRequestingChangesReg] = useState<RegistrationRequest | null>(null);
  const [resubmissionNotes, setResubmissionNotes] = useState('');
  const [rejectingUser, setRejectingUser] = useState<UserProfile | null>(null);
  const [userRejectReason, setUserRejectReason] = useState('');

  // Toast / feedback message inside component
  const [localBanner, setLocalBanner] = useState<{ type: 'success' | 'info' | 'error'; text: string } | null>(null);

  const showFeedback = (text: string, type: 'success' | 'info' | 'error' = 'success') => {
    setLocalBanner({ type, text });
    if (onNotification) {
      onNotification(text);
    }
    setTimeout(() => {
      setLocalBanner(null);
    }, 6000);
  };

  const fetchAllData = () => {
    try {
      const requests = loadRegistrationRequests();
      setRegRequests(requests);
      const users = loadUsers();
      setUsersList(users);
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  // =========================================================================
  // STAGE 1: REGISTRATION REQUEST HANDLERS
  // =========================================================================
  const handleApproveRegistration = async (req: RegistrationRequest) => {
    try {
      // Attempt backend API first
      let success = false;
      let createdUserId = '';
      try {
        const res = await fetch(`/api/admin/registration-requests/${req.id}/approve`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            reviewerName: effectiveReviewerName,
            reviewerRole
          })
        });
        const data = await res.json();
        if (data.success) {
          success = true;
          createdUserId = data.user?.id || req.userId || '';
        }
      } catch {
        // Fallback to local client service
        const localRes = approveRegistrationRequest(req.id, effectiveReviewerName, currentRole);
        if (localRes.success) {
          success = true;
          createdUserId = localRes.user?.id || '';
        }
      }

      if (success) {
        fetchAllData();
        showFeedback(
          `Registration approved for ${req.fullName}! Created permanent User ID (${createdUserId}) and Profile. Account activated (Verification remains Pending).`,
          'success'
        );
      }
    } catch (err: any) {
      showFeedback(err.message || 'Failed to approve registration.', 'error');
    }
  };

  const handleConfirmRejectRegistration = async () => {
    if (!rejectingReg || !rejectionReason.trim()) return;
    try {
      let success = false;
      try {
        const res = await fetch(`/api/admin/registration-requests/${rejectingReg.id}/reject`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            reason: rejectionReason.trim(),
            reviewerName: effectiveReviewerName,
            reviewerRole
          })
        });
        const data = await res.json();
        if (data.success) success = true;
      } catch {
        const localRes = rejectRegistrationRequest(rejectingReg.id, effectiveReviewerName, currentRole, rejectionReason.trim());
        if (localRes.success) success = true;
      }

      if (success) {
        fetchAllData();
        showFeedback(`Registration request for ${rejectingReg.fullName} rejected with feedback. Candidate can resubmit without duplicate ID.`, 'info');
        setRejectingReg(null);
        setRejectionReason('');
      }
    } catch (err: any) {
      showFeedback(err.message || 'Failed to reject registration.', 'error');
    }
  };

  const handleConfirmRequestChanges = async () => {
    if (!requestingChangesReg || !resubmissionNotes.trim()) return;
    try {
      let success = false;
      try {
        const res = await fetch(`/api/admin/registration-requests/${requestingChangesReg.id}/request-changes`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            notes: resubmissionNotes.trim(),
            reviewerName: effectiveReviewerName,
            reviewerRole
          })
        });
        const data = await res.json();
        if (data.success) success = true;
      } catch {
        const localRes = requestChangesForRegistration(requestingChangesReg.id, effectiveReviewerName, currentRole, resubmissionNotes.trim());
        if (localRes.success) success = true;
      }

      if (success) {
        fetchAllData();
        showFeedback(`Requested changes from ${requestingChangesReg.fullName}. Applicant can update details and resubmit without creating duplicate records.`, 'info');
        setRequestingChangesReg(null);
        setResubmissionNotes('');
      }
    } catch (err: any) {
      showFeedback(err.message || 'Failed to request changes.', 'error');
    }
  };

  // =========================================================================
  // STAGE 2: ROLE DOCUMENT VERIFICATION HANDLERS (✓ VERIFIED USER)
  // =========================================================================
  const handleApproveRoleVerification = async (user: UserProfile) => {
    try {
      let success = false;
      try {
        const res = await fetch(`/api/admin/verify-user/${user.id}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            reviewerName: effectiveReviewerName,
            reviewerRole
          })
        });
        const data = await res.json();
        if (data.success) success = true;
      } catch {
        const localRes = verifyUserIdentity(user.id, effectiveReviewerName, currentRole);
        if (localRes.success) success = true;
      }

      if (success) {
        fetchAllData();
        showFeedback(`All role-specific documents verified for ${user.fullName}. ✓ Verified User badge awarded!`, 'success');
      }
    } catch (err: any) {
      showFeedback(err.message || 'Verification approval failed.', 'error');
    }
  };

  const handleConfirmRejectRoleVerification = async () => {
    if (!rejectingUser || !userRejectReason.trim()) return;
    try {
      let success = false;
      try {
        const res = await fetch(`/api/admin/reject-verification/${rejectingUser.id}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            reason: userRejectReason.trim(),
            reviewerName: effectiveReviewerName,
            reviewerRole
          })
        });
        const data = await res.json();
        if (data.success) success = true;
      } catch {
        const localRes = rejectUserVerification(rejectingUser.id, effectiveReviewerName, currentRole, userRejectReason.trim());
        if (localRes.success) success = true;
      }

      if (success) {
        fetchAllData();
        showFeedback(`Document verification rejected for ${rejectingUser.fullName}. Candidate notified to submit updated documents.`, 'info');
        setRejectingUser(null);
        setUserRejectReason('');
      }
    } catch (err: any) {
      showFeedback(err.message || 'Failed to reject verification.', 'error');
    }
  };

  // =========================================================================
  // FILTERING LOGIC
  // =========================================================================
  const filteredRegRequests = regRequests.filter((r) => {
    const term = regSearchTerm.toLowerCase();
    const matchesSearch =
      r.fullName.toLowerCase().includes(term) ||
      r.email.toLowerCase().includes(term) ||
      (r.institution && r.institution.toLowerCase().includes(term)) ||
      (r.rollNumber && r.rollNumber.toLowerCase().includes(term)) ||
      (r.department && r.department.toLowerCase().includes(term)) ||
      r.id.toLowerCase().includes(term);

    const matchesStatus = regFilterStatus === 'ALL' || r.status === regFilterStatus;
    const matchesRole = regFilterRole === 'ALL' || r.role === regFilterRole;

    return matchesSearch && matchesStatus && matchesRole;
  });

  const filteredUsers = usersList.filter((u) => {
    const term = verSearchTerm.toLowerCase();
    const matchesSearch =
      u.fullName.toLowerCase().includes(term) ||
      u.email.toLowerCase().includes(term) ||
      (u.institution && u.institution.toLowerCase().includes(term)) ||
      (u.department && u.department.toLowerCase().includes(term)) ||
      u.id.toLowerCase().includes(term);

    const isVerified = u.verifiedStatus === 'Verified';
    const isPending = !isVerified && (u.documentStatus === 'PENDING' || u.documentStatus === 'SUBMITTED' || !u.documentStatus);
    const isRejected = u.documentStatus === 'REJECTED';

    let matchesStatus = true;
    if (verFilterStatus === 'VERIFIED') matchesStatus = isVerified;
    else if (verFilterStatus === 'PENDING') matchesStatus = isPending;
    else if (verFilterStatus === 'REJECTED') matchesStatus = isRejected;

    const matchesRole = verFilterRole === 'ALL' || u.role === verFilterRole;

    return matchesSearch && matchesStatus && matchesRole;
  });

  // Counts
  const pendingRegCount = regRequests.filter(r => r.status === 'PENDING').length;
  const approvedRegCount = regRequests.filter(r => r.status === 'APPROVED').length;
  const pendingVerCount = usersList.filter(u => u.verifiedStatus !== 'Verified').length;
  const verifiedUserCount = usersList.filter(u => u.verifiedStatus === 'Verified').length;

  const getRoleBadgeColor = (role: UserRole) => {
    switch (role) {
      case 'STUDENT': return 'bg-blue-50 text-blue-800 border-blue-200';
      case 'ALUMNI': return 'bg-purple-50 text-purple-800 border-purple-200';
      case 'DEVELOPER': return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'RESEARCHER': return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'INDUSTRY_PROFESSIONAL': return 'bg-teal-50 text-teal-800 border-teal-200';
      case 'FACULTY': return 'bg-rose-50 text-rose-800 border-rose-200';
      case 'HOD': return 'bg-indigo-50 text-indigo-800 border-indigo-200';
      case 'INSTITUTION': return 'bg-sky-50 text-sky-800 border-sky-200';
      default: return 'bg-zinc-50 text-zinc-800 border-zinc-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Reviewer Details */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#111111]" />
            <h2 className="font-display text-2xl text-[#111111] font-normal">
              Identity Verification & Registration Queue
            </h2>
          </div>
          <p className="text-xs text-[#555555] mt-1 leading-relaxed">
            Authorized institutional gatekeeper console. Review registration requests, approve permanent User IDs and profiles, and verify role documents to award the <em>✓ Verified User</em> seal.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="px-3 py-1 rounded-xl bg-[#F7F7F5] border border-black/10 text-xs font-mono-code text-[#444444]">
            Reviewer: <strong>{effectiveReviewerName}</strong>
          </span>
        </div>
      </div>

      {/* Local Notification Banner */}
      {localBanner && (
        <div 
          className={`p-3.5 rounded-2xl border text-xs flex items-center justify-between shadow-xs transition-all ${
            localBanner.type === 'success' 
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900' 
              : localBanner.type === 'error'
              ? 'bg-red-50 border-red-200 text-red-900'
              : 'bg-blue-50 border-blue-200 text-blue-900'
          }`}
        >
          <div className="flex items-center gap-2">
            {localBanner.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : localBanner.type === 'error' ? (
              <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
            ) : (
              <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
            )}
            <span className="font-medium">{localBanner.text}</span>
          </div>
          <button 
            onClick={() => setLocalBanner(null)} 
            className="p-1 rounded-md hover:bg-black/5 cursor-pointer text-current"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Two-Stage Flow Visual Bar */}
      <div className="p-4 rounded-2xl bg-white border border-black/8 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-black/6 pb-2.5">
          <span className="text-xs font-semibold text-[#111111] flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            Strict Lifecycle Workflow: Registration Approval ≠ Verified User
          </span>
          <span className="text-[11px] font-mono-code text-[#777777]">
            Dual Stage Gatekeeping
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          {/* Stage 1 Card */}
          <div 
            onClick={() => setActiveQueue('REGISTRATION_REQUESTS')}
            className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
              activeQueue === 'REGISTRATION_REQUESTS'
                ? 'bg-amber-50/50 border-amber-300 ring-2 ring-amber-200/50'
                : 'bg-[#FBFBFA] border-black/6 hover:bg-[#F7F7F5]'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-semibold text-[#111111] flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-600" />
                Stage 1: Registration Requests Queue
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono-code bg-amber-100 text-amber-900 font-bold">
                {pendingRegCount} Pending
              </span>
            </div>
            <p className="text-[11px] text-[#666666] leading-relaxed">
              Review candidate identity details & documents. Approving creates exactly <strong>1 Permanent User ID</strong> and <strong>1 Profile</strong>, and activates account. <em>Verification remains Pending.</em>
            </p>
          </div>

          {/* Stage 2 Card */}
          <div 
            onClick={() => setActiveQueue('ROLE_VERIFICATION')}
            className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
              activeQueue === 'ROLE_VERIFICATION'
                ? 'bg-emerald-50/50 border-emerald-300 ring-2 ring-emerald-200/50'
                : 'bg-[#FBFBFA] border-black/6 hover:bg-[#F7F7F5]'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-semibold text-[#111111] flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Stage 2: Role Document Verification Queue
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono-code bg-emerald-100 text-emerald-900 font-bold">
                {verifiedUserCount} Verified
              </span>
            </div>
            <p className="text-[11px] text-[#666666] leading-relaxed">
              Verify role-specific documents and credentials. Approving awards the official <strong>✓ Verified User</strong> badge to the profile.
            </p>
          </div>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* VIEW 1: REGISTRATION REQUESTS QUEUE (STAGE 1) */}
      {/* ===================================================================== */}
      {activeQueue === 'REGISTRATION_REQUESTS' && (
        <div className="space-y-4">
          {/* Controls Bar: Search & Filters */}
          <div className="flex flex-col md:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#737373]" />
              <input
                type="text"
                placeholder="Search candidate by name, email, roll number, department, request ID..."
                value={regSearchTerm}
                onChange={(e) => setRegSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#F7F7F5] border border-black/10 text-[#111111] placeholder-[#737373] text-xs focus:outline-none focus:border-black focus:bg-white transition-colors"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              <select
                value={regFilterStatus}
                onChange={(e) => setRegFilterStatus(e.target.value)}
                className="px-3 py-2.5 rounded-xl bg-[#F7F7F5] border border-black/10 text-xs text-[#111111] focus:outline-none focus:border-black transition-colors cursor-pointer"
              >
                <option value="ALL">All Statuses ({regRequests.length})</option>
                <option value="PENDING">Pending Review ({pendingRegCount})</option>
                <option value="APPROVED">Approved ({approvedRegCount})</option>
                <option value="NEEDS_RESUBMISSION">Changes Requested</option>
                <option value="REJECTED">Rejected</option>
              </select>

              <select
                value={regFilterRole}
                onChange={(e) => setRegFilterRole(e.target.value)}
                className="px-3 py-2.5 rounded-xl bg-[#F7F7F5] border border-black/10 text-xs text-[#111111] focus:outline-none focus:border-black transition-colors cursor-pointer"
              >
                <option value="ALL">All Roles</option>
                <option value="STUDENT">Student</option>
                <option value="ALUMNI">Alumni</option>
                <option value="DEVELOPER">Developer</option>
                <option value="RESEARCHER">Researcher</option>
                <option value="INDUSTRY_PROFESSIONAL">Industry Pro</option>
                <option value="FACULTY">Faculty</option>
                <option value="HOD">HOD</option>
                <option value="INSTITUTION">Institution</option>
              </select>
            </div>
          </div>

          {/* Registration Requests List */}
          <div className="space-y-3">
            {filteredRegRequests.length === 0 ? (
              <div className="p-8 rounded-2xl bg-[#FBFBFA] border border-black/8 text-center text-xs text-[#737373] space-y-2">
                <p>No registration requests found matching your filter criteria.</p>
                <p className="text-[11px] text-[#999999]">Submit a new registration via the Sign Up modal to populate this review queue.</p>
              </div>
            ) : (
              filteredRegRequests.map((req) => {
                const isPending = req.status === 'PENDING';
                const isApproved = req.status === 'APPROVED';
                const isRejected = req.status === 'REJECTED';
                const isNeedsResubmission = req.status === 'NEEDS_RESUBMISSION';

                return (
                  <div
                    key={req.id}
                    className="bg-white rounded-2xl p-5 border border-black/8 hover:border-black/20 transition-all shadow-xs space-y-4"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                      {/* Left: Identity info */}
                      <div className="space-y-1.5 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-[10px] font-mono-code px-2 py-0.5 rounded-full bg-black/5 text-[#111111] font-semibold">
                            {req.id}
                          </span>
                          <span className={`text-[10px] font-mono-code px-2.5 py-0.5 rounded-full font-semibold border ${getRoleBadgeColor(req.role)}`}>
                            {req.role}
                          </span>
                          <span
                            className={`text-[10px] font-mono-code px-2 py-0.5 rounded-full font-medium ${
                              isApproved
                                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                                : isPending
                                ? 'bg-amber-50 text-amber-800 border border-amber-200'
                                : isNeedsResubmission
                                ? 'bg-purple-50 text-purple-800 border border-purple-200'
                                : 'bg-red-50 text-red-800 border border-red-200'
                            }`}
                          >
                            {isApproved ? '✓ APPROVED (USER CREATED)' : isPending ? '⏳ PENDING REVIEW' : isNeedsResubmission ? '↺ RESUBMISSION REQUESTED' : '✕ REJECTED'}
                          </span>
                          {isApproved && req.userId && (
                            <span className="text-[10px] font-mono-code px-2 py-0.5 rounded-md bg-zinc-100 text-zinc-800 border border-zinc-200">
                              UID: {req.userId}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-3 pt-1">
                          <h3 className="text-base font-semibold text-[#111111]">{req.fullName}</h3>
                          <div className="flex items-center gap-1.5 text-xs text-emerald-700">
                            <span className="text-[11px] bg-emerald-50 border border-emerald-200 px-2 py-0.2 rounded font-medium">
                              {req.emailVerified && req.mobileVerified ? 'Contact Verified ✓' : 'Partially Verified'}
                            </span>
                          </div>
                        </div>

                        <p className="text-xs text-[#555555]">
                          {req.email} • {req.mobile || 'No mobile specified'}
                        </p>

                        {(req.institution || req.department) && (
                          <p className="text-xs text-[#666666] font-medium">
                            {req.institution} {req.department ? `• ${req.department}` : ''}
                          </p>
                        )}
                      </div>

                      {/* Right: Actions */}
                      <div className="flex flex-wrap items-center gap-2 shrink-0">
                        <button
                          onClick={() => setInspectingReg(req)}
                          className="px-3 py-1.5 rounded-xl bg-[#F7F7F5] hover:bg-[#EBEBE8] border border-black/8 text-xs text-[#111111] font-medium flex items-center gap-1.5 cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Inspect</span>
                        </button>

                        {isPending && (
                          <>
                            <button
                              onClick={() => {
                                setRequestingChangesReg(req);
                                setResubmissionNotes('Please provide a clearer copy of your institutional ID and re-verify your department designation.');
                              }}
                              className="px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 border border-purple-200 text-xs text-purple-800 font-medium flex items-center gap-1 cursor-pointer"
                            >
                              <RotateCcw className="w-3.5 h-3.5" />
                              <span>Request Changes</span>
                            </button>

                            <button
                              onClick={() => {
                                setRejectingReg(req);
                                setRejectionReason('Submitted credentials could not be verified with institutional registrar records.');
                              }}
                              className="px-3 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 border border-red-200 text-xs text-red-700 font-medium flex items-center gap-1 cursor-pointer"
                            >
                              <X className="w-3.5 h-3.5" />
                              <span>Reject</span>
                            </button>

                            <button
                              onClick={() => handleApproveRegistration(req)}
                              className="btn-primary-black px-4 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>Approve Registration</span>
                            </button>
                          </>
                        )}

                        {isApproved && (
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] font-mono-code text-emerald-700 bg-emerald-50 px-3 py-1 rounded-xl border border-emerald-200 font-semibold flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              Account Activated
                            </span>
                            <button
                              onClick={() => {
                                setActiveQueue('ROLE_VERIFICATION');
                                setVerSearchTerm(req.email);
                              }}
                              className="px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-200 text-xs text-blue-800 font-medium flex items-center gap-1 cursor-pointer"
                            >
                              <span>View in Stage 2</span>
                              <ArrowRight className="w-3 h-3" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Metadata summary bar */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3 border-t border-black/8 text-xs font-mono-code text-[#737373]">
                      <div>
                        <span className="block text-[10px] uppercase text-[#737373]">Identifier</span>
                        <span className="text-[#111111] font-semibold">
                          {req.rollNumber || req.facultyId || req.githubHandle || req.officialDomain || 'N/A'}
                        </span>
                      </div>
                      <div>
                        <span className="block text-[10px] uppercase text-[#737373]">Cohort / Details</span>
                        <span className="text-[#111111] font-semibold">
                          {req.batch || req.graduationYear || req.designation || req.primaryTechStack?.join(', ') || 'Standard'}
                        </span>
                      </div>
                      <div>
                        <span className="block text-[10px] uppercase text-[#737373]">Attached Documents</span>
                        <span className="text-[#111111] font-semibold">
                          {req.documents && req.documents.length > 0 ? `${req.documents.length} File(s)` : 'None Required'}
                        </span>
                      </div>
                      <div>
                        <span className="block text-[10px] uppercase text-[#737373]">Submitted</span>
                        <span className="text-[#111111] font-semibold">
                          {new Date(req.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    {/* Attached Document Pill if available */}
                    {req.documents && req.documents.length > 0 && (
                      <div className="p-3 rounded-xl bg-[#FBFBFA] border border-black/6 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2.5">
                          <FileText className="w-4 h-4 text-[#111111] shrink-0" />
                          <div>
                            <span className="font-semibold text-[#111111] block">
                              {req.documents[0].fileName}
                            </span>
                            <span className="text-[10.5px] text-[#737373] font-mono-code">
                              {req.documents[0].documentType} • {req.documents[0].fileSize} • Status: {req.documents[0].status}
                            </span>
                          </div>
                        </div>

                        <span className="text-[10px] font-mono-code text-blue-800 bg-blue-50 px-2.5 py-0.5 rounded border border-blue-200">
                          {req.documents[0].status}
                        </span>
                      </div>
                    )}

                    {/* Rejection / Resubmission reason alert */}
                    {isRejected && req.rejectionReason && (
                      <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-800 flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-semibold">Rejection Feedback:</span>
                          <p className="mt-0.5">{req.rejectionReason}</p>
                        </div>
                      </div>
                    )}

                    {isNeedsResubmission && req.resubmissionNotes && (
                      <div className="p-3 rounded-xl bg-purple-50 border border-purple-200 text-xs text-purple-900 flex items-start gap-2">
                        <RotateCcw className="w-4 h-4 text-purple-700 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-semibold">Action Requested from Candidate:</span>
                          <p className="mt-0.5">{req.resubmissionNotes}</p>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* VIEW 2: ROLE DOCUMENT VERIFICATION QUEUE (STAGE 2) */}
      {/* ===================================================================== */}
      {activeQueue === 'ROLE_VERIFICATION' && (
        <div className="space-y-4">
          {/* Controls Bar */}
          <div className="flex flex-col md:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#737373]" />
              <input
                type="text"
                placeholder="Search active users by name, email, department, institution..."
                value={verSearchTerm}
                onChange={(e) => setVerSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#F7F7F5] border border-black/10 text-[#111111] placeholder-[#737373] text-xs focus:outline-none focus:border-black focus:bg-white transition-colors"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              <select
                value={verFilterStatus}
                onChange={(e) => setVerFilterStatus(e.target.value)}
                className="px-3 py-2.5 rounded-xl bg-[#F7F7F5] border border-black/10 text-xs text-[#111111] focus:outline-none focus:border-black transition-colors cursor-pointer"
              >
                <option value="ALL">All Verification Statuses</option>
                <option value="PENDING">Pending Verification ({pendingVerCount})</option>
                <option value="VERIFIED">Verified ({verifiedUserCount})</option>
                <option value="REJECTED">Rejected</option>
              </select>

              <select
                value={verFilterRole}
                onChange={(e) => setVerFilterRole(e.target.value)}
                className="px-3 py-2.5 rounded-xl bg-[#F7F7F5] border border-black/10 text-xs text-[#111111] focus:outline-none focus:border-black transition-colors cursor-pointer"
              >
                <option value="ALL">All Roles</option>
                <option value="STUDENT">Student</option>
                <option value="ALUMNI">Alumni</option>
                <option value="DEVELOPER">Developer</option>
                <option value="RESEARCHER">Researcher</option>
                <option value="INDUSTRY_PROFESSIONAL">Industry Pro</option>
                <option value="FACULTY">Faculty</option>
                <option value="HOD">HOD</option>
                <option value="INSTITUTION">Institution</option>
              </select>
            </div>
          </div>

          {/* Active Users Document Queue */}
          <div className="space-y-3">
            {filteredUsers.length === 0 ? (
              <div className="p-8 rounded-2xl bg-[#FBFBFA] border border-black/8 text-center text-xs text-[#737373]">
                No user profiles found matching your verification filters.
              </div>
            ) : (
              filteredUsers.map((user) => {
                const isVerified = user.verifiedStatus === 'Verified';
                const isRejected = user.documentStatus === 'REJECTED';
                const isPending = !isVerified && !isRejected;

                return (
                  <div
                    key={user.id}
                    className="bg-white rounded-2xl p-5 border border-black/8 hover:border-black/20 transition-all shadow-xs space-y-4"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                      {/* Identity info */}
                      <div className="space-y-1.5 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-[10px] font-mono-code px-2 py-0.5 rounded-full bg-black/5 text-[#111111] font-semibold">
                            UID: {user.id}
                          </span>
                          <span className={`text-[10px] font-mono-code px-2.5 py-0.5 rounded-full font-semibold border ${getRoleBadgeColor(user.role)}`}>
                            {user.role}
                          </span>
                          <span
                            className={`text-[10px] font-mono-code px-2.5 py-0.5 rounded-full font-semibold ${
                              isVerified
                                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                                : isPending
                                ? 'bg-amber-50 text-amber-800 border border-amber-200'
                                : 'bg-red-50 text-red-800 border border-red-200'
                            }`}
                          >
                            {isVerified ? '✓ VERIFIED USER' : isPending ? '⏳ VERIFICATION PENDING' : '✕ VERIFICATION REJECTED'}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 pt-1">
                          <h3 className="text-base font-semibold text-[#111111]">{user.fullName}</h3>
                          {isVerified && (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.2 rounded border border-emerald-200">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              Official Verified Seal
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-[#555555]">
                          {user.email} • {user.institution || 'Independent Contributor'}
                        </p>
                      </div>

                      {/* Right: Actions */}
                      <div className="flex flex-wrap items-center gap-2 shrink-0">
                        <button
                          onClick={() => setInspectingUser(user)}
                          className="px-3 py-1.5 rounded-xl bg-[#F7F7F5] hover:bg-[#EBEBE8] border border-black/8 text-xs text-[#111111] font-medium flex items-center gap-1.5 cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Inspect Profile</span>
                        </button>

                        {!isVerified && (
                          <>
                            <button
                              onClick={() => {
                                setRejectingUser(user);
                                setUserRejectReason('Role verification documents submitted do not match institutional registrar credentials.');
                              }}
                              className="px-3 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 border border-red-200 text-xs text-red-700 font-medium flex items-center gap-1 cursor-pointer"
                            >
                              <X className="w-3.5 h-3.5" />
                              <span>Reject Document</span>
                            </button>

                            <button
                              onClick={() => handleApproveRoleVerification(user)}
                              className="btn-primary-black px-4 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>Verify & Grant ✓ Badge</span>
                            </button>
                          </>
                        )}

                        {isVerified && (
                          <div className="flex items-center gap-1.5 text-xs text-[#777777] font-mono-code">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            <span>Granted by {user.reviewedBy || 'Reviewer'}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Verification Signals Matrix */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3 border-t border-black/8 text-xs font-mono-code text-[#737373]">
                      <div>
                        <span className="block text-[10px] uppercase text-[#737373]">Academic / Org Proof</span>
                        <span className={user.verificationSignals?.academicVerified || isVerified ? 'text-emerald-700 font-bold' : 'text-amber-700'}>
                          {user.verificationSignals?.academicVerified || isVerified ? 'Verified ✓' : 'Under Review ⏳'}
                        </span>
                      </div>
                      <div>
                        <span className="block text-[10px] uppercase text-[#737373]">Identity Document</span>
                        <span className={user.verificationSignals?.documentVerified || isVerified ? 'text-emerald-700 font-bold' : 'text-amber-700'}>
                          {user.verificationSignals?.documentVerified || isVerified ? 'Verified ✓' : 'Under Review ⏳'}
                        </span>
                      </div>
                      <div>
                        <span className="block text-[10px] uppercase text-[#737373]">Contact Signals</span>
                        <span className={user.verificationSignals?.emailVerified ? 'text-emerald-700 font-bold' : 'text-amber-700'}>
                          {user.verificationSignals?.emailVerified ? 'Email Verified ✓' : 'Unconfirmed'}
                        </span>
                      </div>
                      <div>
                        <span className="block text-[10px] uppercase text-[#737373]">Institutional Node</span>
                        <span className={isVerified ? 'text-emerald-700 font-bold' : 'text-zinc-700'}>
                          {isVerified ? 'Node Approved ✓' : 'Gatekeeping'}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* MODAL: INSPECT REGISTRATION REQUEST (STAGE 1) */}
      {/* ===================================================================== */}
      {inspectingReg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-xl w-full border border-black/10 shadow-2xl text-[#111111] max-h-[90vh] overflow-y-auto space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-black/8">
              <div>
                <h3 className="font-display text-xl text-[#111111] font-normal">
                  Registration Candidate Record
                </h3>
                <span className="text-[11px] font-mono-code text-[#777777]">
                  Request ID: {inspectingReg.id}
                </span>
              </div>
              <button
                onClick={() => setInspectingReg(null)}
                className="w-7 h-7 rounded-full bg-[#F5F5F3] hover:bg-[#EBEBE8] border border-black/8 flex items-center justify-center text-[#4A4A4A] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-4 rounded-2xl bg-[#F7F7F5] border border-black/8 space-y-2">
                <div className="flex justify-between">
                  <span className="text-[#737373]">Full Name:</span>
                  <span className="font-semibold text-[#111111]">{inspectingReg.fullName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#737373]">Selected Role:</span>
                  <span className="font-semibold text-[#111111]">{inspectingReg.role}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#737373]">Email Address:</span>
                  <span className="font-semibold text-[#111111] font-mono-code">{inspectingReg.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#737373]">Mobile Number:</span>
                  <span className="font-semibold text-[#111111] font-mono-code">{inspectingReg.mobile || 'None'}</span>
                </div>
                {inspectingReg.institution && (
                  <div className="flex justify-between">
                    <span className="text-[#737373]">Institution:</span>
                    <span className="font-semibold text-[#111111]">{inspectingReg.institution}</span>
                  </div>
                )}
                {inspectingReg.department && (
                  <div className="flex justify-between">
                    <span className="text-[#737373]">Department:</span>
                    <span className="font-semibold text-[#111111]">{inspectingReg.department}</span>
                  </div>
                )}
                {inspectingReg.rollNumber && (
                  <div className="flex justify-between">
                    <span className="text-[#737373]">Roll / Enrollment Number:</span>
                    <span className="font-semibold text-[#111111] font-mono-code">{inspectingReg.rollNumber}</span>
                  </div>
                )}
                {inspectingReg.facultyId && (
                  <div className="flex justify-between">
                    <span className="text-[#737373]">Faculty ID:</span>
                    <span className="font-semibold text-[#111111] font-mono-code">{inspectingReg.facultyId}</span>
                  </div>
                )}
                {inspectingReg.githubHandle && (
                  <div className="flex justify-between">
                    <span className="text-[#737373]">GitHub:</span>
                    <span className="font-semibold text-[#111111]">@{inspectingReg.githubHandle}</span>
                  </div>
                )}
              </div>

              {/* Uploaded Documents in Request */}
              <div className="p-4 rounded-2xl border border-black/10 bg-white space-y-2">
                <h4 className="font-semibold text-[#111111]">Attached Verification Documents</h4>
                {inspectingReg.documents && inspectingReg.documents.length > 0 ? (
                  inspectingReg.documents.map((doc, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-[#FBFBFA] border border-black/6 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-semibold text-[#111111] block">{doc.fileName}</span>
                        <span className="text-[10.5px] text-[#737373] font-mono-code">
                          {doc.documentType} • {doc.fileSize} • Uploaded {new Date(doc.uploadedAt).toLocaleDateString()}
                        </span>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono-code bg-amber-50 text-amber-800 border border-amber-200">
                        {doc.status}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-[#737373] text-xs">No external file was required for this role during registration.</p>
                )}
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-black/8">
              <button
                onClick={() => setInspectingReg(null)}
                className="px-4 py-2 rounded-xl bg-[#F5F5F3] hover:bg-[#EBEBE8] text-xs text-[#4A4A4A] font-medium cursor-pointer"
              >
                Close
              </button>
              {inspectingReg.status === 'PENDING' && (
                <button
                  onClick={() => {
                    handleApproveRegistration(inspectingReg);
                    setInspectingReg(null);
                  }}
                  className="btn-primary-black px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Approve Registration</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* MODAL: INSPECT USER PROFILE (STAGE 2) */}
      {/* ===================================================================== */}
      {inspectingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-xl w-full border border-black/10 shadow-2xl text-[#111111] max-h-[90vh] overflow-y-auto space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-black/8">
              <div>
                <h3 className="font-display text-xl text-[#111111] font-normal">
                  Active User Profile & Credentials
                </h3>
                <span className="text-[11px] font-mono-code text-[#777777]">
                  Permanent UID: {inspectingUser.id}
                </span>
              </div>
              <button
                onClick={() => setInspectingUser(null)}
                className="w-7 h-7 rounded-full bg-[#F5F5F3] hover:bg-[#EBEBE8] border border-black/8 flex items-center justify-center text-[#4A4A4A] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-4 rounded-2xl bg-[#F7F7F5] border border-black/8 space-y-2">
                <div className="flex justify-between">
                  <span className="text-[#737373]">Full Name:</span>
                  <span className="font-semibold text-[#111111]">{inspectingUser.fullName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#737373]">Role:</span>
                  <span className="font-semibold text-[#111111]">{inspectingUser.role}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#737373]">Verification Seal:</span>
                  <span className={inspectingUser.verifiedStatus === 'Verified' ? 'text-emerald-700 font-bold' : 'text-amber-700 font-semibold'}>
                    {inspectingUser.verifiedStatus === 'Verified' ? '✓ Verified User' : 'Pending Verification'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#737373]">Email:</span>
                  <span className="font-semibold text-[#111111] font-mono-code">{inspectingUser.email}</span>
                </div>
                {inspectingUser.institution && (
                  <div className="flex justify-between">
                    <span className="text-[#737373]">Institution:</span>
                    <span className="font-semibold text-[#111111]">{inspectingUser.institution}</span>
                  </div>
                )}
                {inspectingUser.department && (
                  <div className="flex justify-between">
                    <span className="text-[#737373]">Department:</span>
                    <span className="font-semibold text-[#111111]">{inspectingUser.department}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-black/8">
              <button
                onClick={() => setInspectingUser(null)}
                className="px-4 py-2 rounded-xl bg-[#F5F5F3] hover:bg-[#EBEBE8] text-xs text-[#4A4A4A] font-medium cursor-pointer"
              >
                Close
              </button>
              {inspectingUser.verifiedStatus !== 'Verified' && (
                <button
                  onClick={() => {
                    handleApproveRoleVerification(inspectingUser);
                    setInspectingUser(null);
                  }}
                  className="btn-primary-black px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Verify All Documents & Award Badge</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* MODAL: REJECT REGISTRATION REQUEST (STAGE 1) */}
      {/* ===================================================================== */}
      {rejectingReg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full border border-black/10 shadow-2xl text-[#111111] space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-xl text-[#111111] font-normal">Reject Registration Request</h3>
              <button
                onClick={() => setRejectingReg(null)}
                className="w-7 h-7 rounded-full bg-[#F5F5F3] hover:bg-[#EBEBE8] border border-black/8 flex items-center justify-center text-[#4A4A4A] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-[#4A4A4A] leading-relaxed">
              Please specify why you are rejecting <strong>{rejectingReg.fullName}</strong> ({rejectingReg.role}). This feedback will be displayed to the applicant, allowing them to correct and resubmit without creating duplicate User IDs.
            </p>

            <textarea
              rows={3}
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="e.g. Identity document is illegible. Please submit a valid institutional ID card."
              className="w-full p-3 rounded-xl bg-[#F7F7F5] border border-black/10 text-xs text-[#111111] focus:outline-none focus:border-black focus:bg-white"
            />

            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-black/8">
              <button
                onClick={() => setRejectingReg(null)}
                className="px-4 py-2 rounded-xl bg-[#F5F5F3] hover:bg-[#EBEBE8] text-xs text-[#4A4A4A] font-medium cursor-pointer"
              >
                Cancel
              </button>
              <button
                disabled={!rejectionReason.trim()}
                onClick={handleConfirmRejectRegistration}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-xs font-semibold text-white cursor-pointer shadow-xs disabled:opacity-50"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* MODAL: REQUEST CHANGES / RESUBMISSION (STAGE 1) */}
      {/* ===================================================================== */}
      {requestingChangesReg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full border border-black/10 shadow-2xl text-[#111111] space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-xl text-[#111111] font-normal">Request Changes from Applicant</h3>
              <button
                onClick={() => setRequestingChangesReg(null)}
                className="w-7 h-7 rounded-full bg-[#F5F5F3] hover:bg-[#EBEBE8] border border-black/8 flex items-center justify-center text-[#4A4A4A] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-[#4A4A4A] leading-relaxed">
              Request updates from <strong>{requestingChangesReg.fullName}</strong>. The applicant can resubmit with corrected information without duplicate accounts or database conflicts.
            </p>

            <textarea
              rows={3}
              value={resubmissionNotes}
              onChange={(e) => setResubmissionNotes(e.target.value)}
              placeholder="e.g. Please update your roll number and upload the latest semester marksheet or institutional ID."
              className="w-full p-3 rounded-xl bg-[#F7F7F5] border border-black/10 text-xs text-[#111111] focus:outline-none focus:border-black focus:bg-white"
            />

            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-black/8">
              <button
                onClick={() => setRequestingChangesReg(null)}
                className="px-4 py-2 rounded-xl bg-[#F5F5F3] hover:bg-[#EBEBE8] text-xs text-[#4A4A4A] font-medium cursor-pointer"
              >
                Cancel
              </button>
              <button
                disabled={!resubmissionNotes.trim()}
                onClick={handleConfirmRequestChanges}
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-xs font-semibold text-white cursor-pointer shadow-xs disabled:opacity-50"
              >
                Send Request
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* MODAL: REJECT ROLE VERIFICATION (STAGE 2) */}
      {/* ===================================================================== */}
      {rejectingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full border border-black/10 shadow-2xl text-[#111111] space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-xl text-[#111111] font-normal">Reject Role Verification</h3>
              <button
                onClick={() => setRejectingUser(null)}
                className="w-7 h-7 rounded-full bg-[#F5F5F3] hover:bg-[#EBEBE8] border border-black/8 flex items-center justify-center text-[#4A4A4A] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-[#4A4A4A] leading-relaxed">
              Reject document verification for <strong>{rejectingUser.fullName}</strong>. The user's account remains active, but the <em>✓ Verified User</em> badge will not be awarded until updated documents are provided.
            </p>

            <textarea
              rows={3}
              value={userRejectReason}
              onChange={(e) => setUserRejectReason(e.target.value)}
              placeholder="e.g. Uploaded document is expired or cannot be validated against registrar records."
              className="w-full p-3 rounded-xl bg-[#F7F7F5] border border-black/10 text-xs text-[#111111] focus:outline-none focus:border-black focus:bg-white"
            />

            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-black/8">
              <button
                onClick={() => setRejectingUser(null)}
                className="px-4 py-2 rounded-xl bg-[#F5F5F3] hover:bg-[#EBEBE8] text-xs text-[#4A4A4A] font-medium cursor-pointer"
              >
                Cancel
              </button>
              <button
                disabled={!userRejectReason.trim()}
                onClick={handleConfirmRejectRoleVerification}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-xs font-semibold text-white cursor-pointer shadow-xs disabled:opacity-50"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
