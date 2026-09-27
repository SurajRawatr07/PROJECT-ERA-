import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CheckCircle2, 
  Clock, 
  FolderGit2, 
  Users, 
  FileCheck2, 
  AlertCircle, 
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Sparkles,
  MessageSquare,
  X,
  Search,
  Check
} from 'lucide-react';
import { FacultyDemoData } from '../../data/roleDemoData';
import { StatsCard } from '../common/StatsCard';
import { EmptyState } from '../common/EmptyState';

interface FacultyDashboardViewProps {
  data: FacultyDemoData;
  onOpenPassport?: (passportId: string) => void;
  onSelectProjectTitle?: (title: string) => void;
}

export const FacultyDashboardView: React.FC<FacultyDashboardViewProps> = ({
  data,
  onOpenPassport,
  onSelectProjectTitle
}) => {
  const [projects, setProjects] = useState(data.projectsUnderGuidance);
  const [pendingReviews, setPendingReviews] = useState(data.pendingReviews);
  const [students, setStudents] = useState(data.studentsGuided);
  const [reviews, setReviews] = useState(data.recentReviews);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('ALL');
  
  // Feedback toast & modal state
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [reviewModalProject, setReviewModalProject] = useState<any | null>(null);
  const [reviewScore, setReviewScore] = useState('9.5');
  const [reviewFeedbackText, setReviewFeedbackText] = useState('');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleVerifyProject = (projectId: string, title: string) => {
    setProjects(prev =>
      prev.map(p => (p.id === projectId ? { ...p, status: 'Verified', score: 9.8 } : p))
    );
    setPendingReviews(prev => prev.filter(pr => pr.projectId !== projectId));
    showToast(`Project "${title}" has been verified and digitally signed!`);
  };

  const handleRequestChanges = (projectId: string, title: string) => {
    setProjects(prev =>
      prev.map(p => (p.id === projectId ? { ...p, status: 'Changes Requested' } : p))
    );
    showToast(`Feedback and change request sent to the student team for "${title}".`);
  };

  const handleOpenReviewModal = (project: any) => {
    setReviewModalProject(project);
    setReviewFeedbackText('Solid academic methodology. Documentation and test suites pass departmental verification rubrics.');
    setReviewScore('9.5');
  };

  const handleSubmitEvaluation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewModalProject) return;

    const parsedScore = parseFloat(reviewScore) || 9.0;
    setProjects(prev =>
      prev.map(p =>
        p.id === reviewModalProject.id
          ? { ...p, status: 'Verified', score: parsedScore }
          : p
      )
    );
    setPendingReviews(prev => prev.filter(pr => pr.projectId !== reviewModalProject.id));
    
    // Add to recent reviews
    setReviews(prev => [
      {
        id: `rr-${Date.now()}`,
        projectTitle: reviewModalProject.title,
        studentLead: reviewModalProject.studentLead,
        evaluatedOn: 'Just now',
        score: parsedScore,
        verdict: 'Approved',
        feedback: reviewFeedbackText
      },
      ...prev
    ]);

    showToast(`Rubric evaluation (${parsedScore}/10) saved for "${reviewModalProject.title}".`);
    setReviewModalProject(null);
  };

  const filteredProjects = projects.filter(p => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.studentLead.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.domain.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      selectedStatusFilter === 'ALL' || p.status === selectedStatusFilter;
    return matchesSearch && matchesStatus;
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

      {/* Welcome Banner */}
      <div className="bg-[#FBFBFA] rounded-3xl p-6 sm:p-8 border border-black/8 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-[11px] font-mono-code text-[#737373] uppercase font-semibold tracking-wider">
              Faculty Advisory & Evaluation Portal
            </span>
            <h1 className="font-display text-2xl sm:text-3xl text-[#111111] mt-1 font-normal">
              Welcome, {data.profile.fullName}
            </h1>
            <p className="text-xs sm:text-sm text-[#555555] mt-1 max-w-2xl leading-relaxed">
              {data.profile.designation || 'Associate Professor'} • {data.profile.department} • {data.profile.institution}
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono-code bg-white px-3 py-1.5 rounded-xl border border-black/8 shadow-2xs self-start md:self-auto">
            <span className="text-[#737373]">Faculty Key:</span>
            <span className="font-bold text-[#111111]">{data.profile.facultyId || 'EMP-GEHU-FAC-409'}</span>
          </div>
        </div>
      </div>

      {/* 4 Required Statistics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatsCard
          label="Projects Mentored"
          value={data.stats.projectsMentored}
          note="Active capstone cohorts"
          icon={FolderGit2}
        />
        <StatsCard
          label="Students Guided"
          value={data.stats.studentsGuided}
          note="Under faculty supervision"
          icon={Users}
        />
        <StatsCard
          label="Pending Reviews"
          value={pendingReviews.length}
          note="Awaiting rubric sign-off"
          icon={Clock}
          trend={pendingReviews.length > 0 ? `${pendingReviews.length} pending` : 'All clear'}
          trendPositive={pendingReviews.length === 0}
        />
        <StatsCard
          label="Verified Projects"
          value={data.stats.verifiedProjects}
          note="Cryptographically signed"
          icon={CheckCircle2}
        />
      </div>

      {/* Section 1: Pending Verification Queue */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-black/8 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display text-xl text-[#111111] font-normal flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-600" />
              Pending Verification & Milestone Queue
            </h2>
            <p className="text-xs text-[#555555]">
              Student submissions awaiting faculty evaluation, rubric scoring, and ECDSA signature.
            </p>
          </div>
          <span className="text-xs font-mono-code px-2.5 py-1 rounded-full bg-amber-50 text-amber-900 border border-amber-200">
            {pendingReviews.length} Action Needed
          </span>
        </div>

        {pendingReviews.length === 0 ? (
          <EmptyState
            type="reviews"
            title="No pending reviews"
            description="You are completely caught up! All student milestones have been evaluated and sealed."
          />
        ) : (
          <div className="space-y-3">
            {pendingReviews.map(item => (
              <div
                key={item.id}
                className="p-4 rounded-xl bg-[#FBFBFA] border border-black/8 hover:border-black/20 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-mono-code px-2 py-0.5 rounded font-medium ${
                        item.priority === 'High'
                          ? 'bg-red-50 text-red-700 border border-red-200'
                          : 'bg-neutral-100 text-neutral-700'
                      }`}
                    >
                      {item.priority} Priority
                    </span>
                    <span className="text-[11px] font-mono-code text-[#737373]">
                      Submitted: {item.submittedAt}
                    </span>
                  </div>

                  <h3 className="text-sm sm:text-base font-bold text-[#111111]">
                    {item.projectTitle}
                  </h3>
                  <p className="text-xs text-[#555555]">
                    Lead: <strong className="text-[#111111]">{item.studentLead}</strong> • Milestone: {item.milestone}
                  </p>
                  <p className="text-[11px] text-[#737373] font-mono-code">
                    Deliverables: {item.deliverables}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2 shrink-0 self-start md:self-auto">
                  <button
                    onClick={() => handleOpenReviewModal(item)}
                    className="px-3 py-1.5 rounded-lg bg-[#111111] hover:bg-black text-white text-xs font-medium transition-all cursor-pointer shadow-xs"
                  >
                    Review Project
                  </button>
                  <button
                    onClick={() => handleVerifyProject(item.projectId, item.projectTitle)}
                    className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium transition-all cursor-pointer shadow-xs inline-flex items-center gap-1"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Verify</span>
                  </button>
                  <button
                    onClick={() => handleRequestChanges(item.projectId, item.projectTitle)}
                    className="px-3 py-1.5 rounded-lg bg-white hover:bg-[#F5F5F3] text-neutral-800 border border-black/15 text-xs font-medium transition-all cursor-pointer"
                  >
                    Request Changes
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Section 2: Projects Under My Guidance */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="font-display text-xl text-[#111111] font-normal">
              Projects Under My Guidance
            </h2>
            <p className="text-xs text-[#555555]">
              Active research and capstones with live mentorship telemetry.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-[#737373] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search projects..."
                className="pl-8 pr-3 py-1.5 rounded-xl bg-white border border-black/10 text-xs text-[#111111] w-40 sm:w-56 focus:outline-none focus:border-black"
              />
            </div>
          </div>
        </div>

        {filteredProjects.length === 0 ? (
          <EmptyState
            type="projects"
            title="No projects found"
            description="No guided projects match your search criteria."
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProjects.map(proj => (
              <div
                key={proj.id}
                className="bg-white rounded-2xl p-5 border border-black/8 hover:border-black/20 transition-all shadow-2xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="text-[10px] font-mono-code px-2 py-0.5 rounded bg-[#F5F5F3] text-[#555555] uppercase">
                      {proj.domain}
                    </span>
                    <span
                      className={`text-[10.5px] font-mono-code px-2 py-0.5 rounded-full font-medium ${
                        proj.status === 'Verified'
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : proj.status === 'In Review'
                          ? 'bg-amber-50 text-amber-800 border border-amber-200'
                          : 'bg-neutral-100 text-neutral-800 border border-neutral-200'
                      }`}
                    >
                      {proj.status}
                    </span>
                  </div>

                  <h3 className="font-display text-base font-normal text-[#111111] mb-1">
                    {proj.title}
                  </h3>
                  <p className="text-xs text-[#555555] mb-2">
                    Lead: <strong className="text-[#111111]">{proj.studentLead}</strong>
                  </p>

                  <div className="flex flex-wrap gap-1 mb-3">
                    {proj.techStack.map(t => (
                      <span
                        key={t}
                        className="text-[10px] font-mono-code px-2 py-0.5 rounded bg-[#F7F7F5] border border-black/5 text-[#333333]"
                      >
                        {t}
                      </span>
                    ))}
                  </div>

                  {proj.score && (
                    <div className="text-xs font-mono-code text-emerald-800 bg-emerald-50/50 p-2 rounded-lg mb-3 border border-emerald-100">
                      Rubric Score: <strong>{proj.score} / 10</strong> (Signed)
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-black/6 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <span className="text-[11px] text-[#737373] font-mono-code">
                    Batch {proj.batch}
                  </span>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleOpenReviewModal(proj)}
                      className="px-2.5 py-1 rounded-lg bg-[#111111] hover:bg-black text-white text-[11px] font-medium transition-all cursor-pointer"
                    >
                      Review Project
                    </button>
                    <button
                      onClick={() => {
                        if (onOpenPassport) onOpenPassport(`PV-2025-${proj.id}`);
                        else showToast(`Opening passport for ${proj.title}`);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-[#F5F5F3] hover:bg-[#EBEBE8] text-[#111111] text-[11px] font-medium transition-all cursor-pointer"
                    >
                      View Passport
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Section 3 & 4: Students Being Mentored + Mentorship Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Students Guided Card */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-black/8 shadow-2xs">
          <h3 className="font-display text-lg text-[#111111] font-normal mb-3 flex items-center justify-between">
            <span>Students Being Mentored</span>
            <span className="text-xs font-mono-code text-[#737373]">{students.length} Total</span>
          </h3>

          <div className="space-y-3">
            {students.map(st => (
              <div
                key={st.id}
                className="p-3 rounded-xl bg-[#FBFBFA] border border-black/5 flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={st.avatar}
                    alt={st.name}
                    className="w-10 h-10 rounded-xl object-cover border border-black/10 shrink-0"
                  />
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-[#111111] truncate">{st.name}</p>
                    <p className="text-[11px] text-[#555555] truncate">
                      {st.rollNumber} • {st.course}
                    </p>
                    <p className="text-[10px] font-mono-code text-[#737373] truncate">
                      Project: {st.projectTitle}
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span
                    className={`text-[10px] font-mono-code px-2 py-0.5 rounded font-medium ${
                      st.status === 'Completed'
                        ? 'bg-emerald-50 text-emerald-800'
                        : st.status === 'Needs Review'
                        ? 'bg-amber-50 text-amber-800'
                        : 'bg-blue-50 text-blue-800'
                    }`}
                  >
                    {st.status}
                  </span>
                  <div className="text-[10px] font-mono-code text-[#737373] mt-1">
                    {st.progress}% done
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Reviews Card */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-black/8 shadow-2xs">
          <h3 className="font-display text-lg text-[#111111] font-normal mb-3">
            Recently Reviewed Projects
          </h3>

          <div className="space-y-3">
            {reviews.map(rev => (
              <div
                key={rev.id}
                className="p-3.5 rounded-xl bg-[#FBFBFA] border border-black/5 space-y-1.5 text-xs"
              >
                <div className="flex items-center justify-between gap-2">
                  <h4 className="font-bold text-[#111111] truncate">{rev.projectTitle}</h4>
                  <span className="font-mono-code font-bold text-emerald-700 shrink-0">
                    {rev.score} / 10
                  </span>
                </div>
                <p className="text-[11px] text-[#555555]">
                  Student: {rev.studentLead} • Evaluated: {rev.evaluatedOn}
                </p>
                <p className="text-xs text-[#333333] bg-white p-2 rounded-lg border border-black/5 italic">
                  "{rev.feedback}"
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mentorship Activity Log */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-black/8 shadow-2xs">
        <h3 className="font-display text-lg text-[#111111] font-normal mb-3">
          Faculty Mentorship Activity
        </h3>
        <div className="space-y-2.5">
          {data.mentorshipActivity.map(act => (
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
                <p className="text-[11px] text-[#555555] mt-0.5">{act.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Review Modal */}
      {reviewModalProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-sm overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-black/10 shadow-2xl text-[#111111]"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <FileCheck2 className="w-5 h-5 text-[#111111]" />
                <h3 className="font-display text-xl text-[#111111] font-normal">
                  Evaluate Project Rubric
                </h3>
              </div>
              <button
                onClick={() => setReviewModalProject(null)}
                className="w-7 h-7 rounded-full bg-[#F5F5F3] hover:bg-[#EBEBE8] flex items-center justify-center text-[#4A4A4A] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-[#555555] mb-4">
              Rubric evaluation for <strong className="text-[#111111]">{reviewModalProject.title}</strong> led by {reviewModalProject.studentLead}.
            </p>

            <form onSubmit={handleSubmitEvaluation} className="space-y-4 text-xs">
              <div>
                <label className="block font-mono-code text-[11px] uppercase font-semibold text-[#737373] mb-1">
                  Rubric Assessment Score (out of 10)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="1"
                  max="10"
                  value={reviewScore}
                  onChange={e => setReviewScore(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-xl bg-[#F7F7F5] border border-black/10 text-sm font-bold text-[#111111] focus:outline-none focus:border-black"
                />
              </div>

              <div>
                <label className="block font-mono-code text-[11px] uppercase font-semibold text-[#737373] mb-1">
                  Faculty Evaluation Feedback & Verdict
                </label>
                <textarea
                  rows={4}
                  value={reviewFeedbackText}
                  onChange={e => setReviewFeedbackText(e.target.value)}
                  required
                  className="w-full p-3 rounded-xl bg-[#F7F7F5] border border-black/10 text-xs text-[#111111] focus:outline-none focus:border-black resize-none"
                />
              </div>

              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-[11px]">
                <p className="font-medium">Digitally Signed Verification</p>
                <p className="text-[10px] text-emerald-800 mt-0.5">
                  Submitting this evaluation attaches your ECDSA signing key to the Project Passport.
                </p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setReviewModalProject(null)}
                  className="px-4 py-2 rounded-xl bg-[#F5F5F3] hover:bg-[#EBEBE8] text-xs font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#111111] hover:bg-black text-white text-xs font-medium cursor-pointer"
                >
                  Confirm & Seal Verification
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};
