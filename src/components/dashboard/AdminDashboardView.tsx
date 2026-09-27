import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, 
  FolderGit2, 
  CheckCircle2, 
  AlertTriangle, 
  Building2, 
  Server, 
  ShieldAlert, 
  Search, 
  X, 
  Check, 
  Eye, 
  Trash2, 
  Clock, 
  Lock,
  ArrowUpRight
} from 'lucide-react';
import { AdminDemoData } from '../../data/roleDemoData';
import { StatsCard } from '../common/StatsCard';
import { EmptyState } from '../common/EmptyState';

interface AdminDashboardViewProps {
  data: AdminDemoData;
  onOpenPassport?: (passportId: string) => void;
}

export const AdminDashboardView: React.FC<AdminDashboardViewProps> = ({
  data,
  onOpenPassport
}) => {
  const [recentUsers, setRecentUsers] = useState(data.recentUsers);
  const [recentProjects, setRecentProjects] = useState(data.recentProjects);
  const [verificationQueue, setVerificationQueue] = useState(data.verificationQueue);
  const [reportedContent, setReportedContent] = useState(data.reportedContent);
  const [searchUserQuery, setSearchUserQuery] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleVerifyQueueItem = (queueId: string, title: string) => {
    setVerificationQueue(prev => prev.filter(q => q.id !== queueId));
    showToast(`Institution-wide verification approved for "${title}".`);
  };

  const handleSuspendUser = (userId: string, name: string) => {
    setRecentUsers(prev =>
      prev.map(u => (u.id === userId ? { ...u, status: u.status === 'Suspended' ? 'Active' : 'Suspended' } : u))
    );
    showToast(`User status toggled for ${name}.`);
  };

  const handleResolveReport = (reportId: string, itemTitle: string) => {
    setReportedContent(prev =>
      prev.map(r => (r.id === reportId ? { ...r, status: 'Resolved' } : r))
    );
    showToast(`Report on "${itemTitle}" marked as resolved.`);
  };

  const filteredUsers = recentUsers.filter(u => {
    return (
      u.name.toLowerCase().includes(searchUserQuery.toLowerCase()) ||
      u.institution.toLowerCase().includes(searchUserQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchUserQuery.toLowerCase()) ||
      u.role.toLowerCase().includes(searchUserQuery.toLowerCase())
    );
  });

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 rounded-xl bg-[#111111] text-white text-xs font-mono-code shadow-xl flex items-center justify-between gap-3 border border-black/10"
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{toastMessage}</span>
            </div>
            <button
              onClick={() => setToastMessage(null)}
              className="text-neutral-400 hover:text-white cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header Banner */}
      <div className="bg-[#FBFBFA] rounded-3xl p-6 sm:p-8 border border-black/8 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-[11px] font-mono-code text-[#737373] uppercase font-semibold tracking-wider">
              Platform Root Command Center
            </span>
            <h1 className="font-display text-2xl sm:text-3xl text-[#111111] mt-1 font-normal">
              Welcome, {data.profile.fullName}
            </h1>
            <p className="text-xs sm:text-sm text-[#555555] mt-1 max-w-2xl leading-relaxed">
              Global Platform Administrator • Academic Ledger Operations & Institutional Identity
            </p>
          </div>

          <div className="flex items-center gap-2 bg-emerald-50 text-emerald-800 border border-emerald-200 px-3.5 py-2 rounded-xl text-xs font-mono-code self-start md:self-auto font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
            <span>Systems Normal (Uptime: 99.98%)</span>
          </div>
        </div>
      </div>

      {/* Platform Macro Statistics (Prompt Specified Numbers) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        <StatsCard
          label="Total Users"
          value={data.stats.totalUsers.toLocaleString()}
          icon={Users}
        />
        <StatsCard
          label="Students"
          value={data.stats.students.toLocaleString()}
          icon={Users}
        />
        <StatsCard
          label="Faculty"
          value={data.stats.faculty.toLocaleString()}
          icon={Users}
        />
        <StatsCard
          label="HODs"
          value={data.stats.hods.toLocaleString()}
          icon={Users}
        />
        <StatsCard
          label="Institutions"
          value={data.stats.institutions.toLocaleString()}
          icon={Building2}
        />
        <StatsCard
          label="Projects"
          value={data.stats.totalProjects.toLocaleString()}
          icon={FolderGit2}
          note={`${data.stats.verifiedProjects} verified`}
        />
      </div>

      {/* Section 1: Verification Queue & Reported Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Verification Queue */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-black/8 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-lg text-[#111111] font-normal flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#111111]" />
              Verification Queue
            </h3>
            <span className="text-xs font-mono-code px-2 py-0.5 rounded bg-neutral-100 text-[#111111]">
              {verificationQueue.length} Pending
            </span>
          </div>

          {verificationQueue.length === 0 ? (
            <EmptyState
              type="verification"
              title="No verification requests"
              description="New requests will appear here when submitted by institutions."
            />
          ) : (
            <div className="space-y-2.5">
              {verificationQueue.map(item => (
                <div
                  key={item.id}
                  className="p-3.5 rounded-xl bg-[#FBFBFA] border border-black/5 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="min-w-0">
                    <span className="text-[10px] font-mono-code text-[#737373] uppercase">
                      {item.type} • {item.institution}
                    </span>
                    <h4 className="font-bold text-[#111111] truncate mt-0.5">{item.title}</h4>
                    <p className="text-[11px] text-[#555555]">Submitter: {item.submittedBy}</p>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => handleVerifyQueueItem(item.id, item.title)}
                      className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-medium transition-all cursor-pointer inline-flex items-center gap-1 shadow-2xs"
                    >
                      <Check className="w-3 h-3" />
                      <span>Verify</span>
                    </button>
                    <button
                      onClick={() => showToast(`Reviewing ${item.title}`)}
                      className="px-2.5 py-1.5 rounded-lg bg-[#111111] hover:bg-black text-white text-[11px] font-medium transition-all cursor-pointer shadow-2xs"
                    >
                      Review
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Reported Content */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-black/8 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-lg text-[#111111] font-normal flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              Reported Content & Flagged Repositories
            </h3>
            <span className="text-xs font-mono-code px-2 py-0.5 rounded bg-amber-50 text-amber-900 border border-amber-200">
              {reportedContent.filter(r => r.status === 'Open').length} Open
            </span>
          </div>

          <div className="space-y-2.5">
            {reportedContent.map(rep => (
              <div
                key={rep.id}
                className="p-3.5 rounded-xl bg-[#FBFBFA] border border-black/5 flex items-center justify-between gap-3 text-xs"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[9.5px] font-mono-code px-1.5 py-0.5 rounded font-medium ${
                        rep.status === 'Resolved'
                          ? 'bg-emerald-50 text-emerald-800'
                          : 'bg-red-50 text-red-800'
                      }`}
                    >
                      {rep.status}
                    </span>
                    <span className="text-[10px] font-mono-code text-[#737373]">
                      Reported by {rep.reportedBy}
                    </span>
                  </div>
                  <h4 className="font-bold text-[#111111] truncate mt-1">{rep.target}</h4>
                  <p className="text-[11px] text-[#555555]">Reason: {rep.reason}</p>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  {rep.status !== 'Resolved' && (
                    <button
                      onClick={() => handleResolveReport(rep.id, rep.target)}
                      className="px-2.5 py-1 rounded-lg bg-[#111111] hover:bg-black text-white text-[11px] font-medium transition-all cursor-pointer"
                    >
                      Resolve
                    </button>
                  )}
                  <button
                    onClick={() => showToast(`Auditing audit logs for ${rep.target}`)}
                    className="px-2 py-1 rounded-lg bg-[#F5F5F3] hover:bg-[#EBEBE8] text-[#111111] text-[11px] font-medium transition-all cursor-pointer"
                  >
                    Review
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Section 2: Recent Users Table */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-black/8 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-display text-lg text-[#111111] font-normal">
              Platform Users Registry
            </h3>
            <p className="text-xs text-[#555555]">
              Cross-institutional identity directory with multi-role permissions.
            </p>
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 text-[#737373] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchUserQuery}
              onChange={e => setSearchUserQuery(e.target.value)}
              placeholder="Search user, email, or role..."
              className="pl-8 pr-3 py-1.5 rounded-xl bg-white border border-black/10 text-xs text-[#111111] w-48 sm:w-64 focus:outline-none focus:border-black"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-black/8 bg-[#FBFBFA] font-mono-code text-[11px] text-[#737373] uppercase">
                <th className="py-2.5 px-3 font-semibold">User</th>
                <th className="py-2.5 px-3 font-semibold">Role</th>
                <th className="py-2.5 px-3 font-semibold">Institution</th>
                <th className="py-2.5 px-3 font-semibold">Joined</th>
                <th className="py-2.5 px-3 font-semibold">Status</th>
                <th className="py-2.5 px-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5 font-body">
              {filteredUsers.map(user => (
                <tr key={user.id} className="hover:bg-[#FBFBFA] transition-colors">
                  <td className="py-2.5 px-3">
                    <div className="flex items-center gap-2">
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-7 h-7 rounded-lg object-cover border border-black/10 shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="font-bold text-[#111111] truncate">{user.name}</p>
                        <p className="text-[10px] text-[#737373] truncate font-mono-code">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-2.5 px-3">
                    <span className="font-mono-code text-[10.5px] px-2 py-0.5 rounded bg-[#F7F7F5] border border-black/5 text-[#333333]">
                      {user.role}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-[#555555] max-w-[150px] truncate">
                    {user.institution}
                  </td>
                  <td className="py-2.5 px-3 text-[#737373] font-mono-code text-[10px]">
                    {user.joined}
                  </td>
                  <td className="py-2.5 px-3">
                    <span
                      className={`text-[10px] font-mono-code px-2 py-0.5 rounded-full font-medium ${
                        user.status === 'Active'
                          ? 'bg-emerald-50 text-emerald-800'
                          : 'bg-red-50 text-red-800'
                      }`}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => showToast(`Viewing profile of ${user.name}`)}
                        className="px-2 py-1 rounded bg-[#F5F5F3] hover:bg-[#EBEBE8] text-[#111111] text-[11px] font-medium transition-all cursor-pointer"
                      >
                        View
                      </button>
                      <button
                        onClick={() => handleSuspendUser(user.id, user.name)}
                        className="px-2 py-1 rounded bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-[11px] font-medium transition-all cursor-pointer"
                      >
                        {user.status === 'Suspended' ? 'Activate' : 'Suspend'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Section 3: Platform Activity & System Overview Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Platform Activity Log */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-black/8 shadow-2xs">
          <h3 className="font-display text-lg text-[#111111] font-normal mb-3">
            Platform Activity Audit Log
          </h3>
          <div className="space-y-2.5">
            {data.platformActivity.map(act => (
              <div
                key={act.id}
                className="p-3 rounded-xl bg-[#FBFBFA] border border-black/5 flex items-start gap-3 text-xs"
              >
                <div className="w-2 h-2 rounded-full bg-[#111111] mt-1.5 shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-bold text-[#111111]">
                      {act.action}: <span className="font-normal text-[#555555]">{act.target}</span>
                    </p>
                    <span className="text-[10px] font-mono-code text-[#737373] shrink-0">{act.time}</span>
                  </div>
                  <p className="text-[11px] text-[#555555] mt-0.5">{act.details}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* System Overview */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-black/8 shadow-2xs space-y-4">
          <h3 className="font-display text-lg text-[#111111] font-normal">
            System Overview & Node Telemetry
          </h3>

          <div className="space-y-3">
            <div className="p-3.5 rounded-xl bg-[#FBFBFA] border border-black/8 flex items-center justify-between text-xs">
              <span className="text-[#555555]">Primary Database (PostgreSQL Shard 01)</span>
              <span className="font-mono-code font-bold text-emerald-700">Healthy (14ms latency)</span>
            </div>
            <div className="p-3.5 rounded-xl bg-[#FBFBFA] border border-black/8 flex items-center justify-between text-xs">
              <span className="text-[#555555]">Cryptographic Ledger Notary Engine</span>
              <span className="font-mono-code font-bold text-emerald-700">Active (ECDSA P-256)</span>
            </div>
            <div className="p-3.5 rounded-xl bg-[#FBFBFA] border border-black/8 flex items-center justify-between text-xs">
              <span className="text-[#555555]">GitHub OAuth Webhook Dispatcher</span>
              <span className="font-mono-code font-bold text-emerald-700">Online</span>
            </div>
            <div className="p-3.5 rounded-xl bg-[#FBFBFA] border border-black/8 flex items-center justify-between text-xs">
              <span className="text-[#555555]">Weekly Automated Backup Snapshot</span>
              <span className="font-mono-code font-bold text-[#111111]">Stored (2 hours ago)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
