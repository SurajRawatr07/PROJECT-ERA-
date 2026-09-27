import React from 'react';
import { 
  FileCheck2, 
  GitBranch, 
  ShieldCheck, 
  ArrowRight, 
  GitFork, 
  CheckCircle2, 
  Layers, 
  GraduationCap, 
  Award,
  Terminal,
  Lock
} from 'lucide-react';

interface InformationalProjectFeaturesProps {
  onGetStarted?: () => void;
  onSignIn?: () => void;
}

export const InformationalProjectFeatures: React.FC<InformationalProjectFeaturesProps> = ({
  onGetStarted,
  onSignIn
}) => {
  return (
    <section className="w-full bg-[#fdfaf4] py-16 sm:py-24 border-t border-neutral-200/80">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20 sm:space-y-28">
        
        {/* 1. PROJECT PASSPORT SECTION */}
        <div id="project-passport" className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          <div className="lg:col-span-6 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-100 border border-neutral-200 text-xs font-mono text-neutral-800">
              <FileCheck2 size={14} />
              <span>Project Identity Framework</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-display font-light tracking-tight text-neutral-900 leading-tight">
              Project <span className="font-normal italic text-[#e8860a]">Passport</span>
            </h2>
            <p className="text-base text-neutral-600 font-body leading-relaxed">
              Every project on ProjectVerse is anchored by a structured Project Passport. Unlike simple Git repositories, 
              a Passport establishes an immutable record of the problem definition, system architecture, research context, 
              verified team contributions, and faculty endorsement.
            </p>
            <div className="pt-2 flex flex-wrap gap-2 text-xs font-mono text-neutral-600">
              <span className="px-2.5 py-1 rounded-md bg-white border border-neutral-200">System Architecture</span>
              <span className="px-2.5 py-1 rounded-md bg-white border border-neutral-200">Rubric Telemetry</span>
              <span className="px-2.5 py-1 rounded-md bg-white border border-neutral-200">Verified Evidence</span>
            </div>
          </div>

          {/* Visual Preview of Passport */}
          <div className="lg:col-span-6">
            <div className="bg-white rounded-3xl border border-neutral-200/90 p-6 sm:p-7 shadow-xs space-y-5">
              <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
                <div>
                  <div className="text-[11px] font-mono text-neutral-400 uppercase">PROJECT PASSPORT ID</div>
                  <div className="font-mono font-semibold text-xs text-neutral-900">PV-2026-CS-089</div>
                </div>
                <span className="inline-flex items-center gap-1 text-[11px] font-mono font-medium px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                  <CheckCircle2 size={12} />
                  <span>Academic Verified</span>
                </span>
              </div>

              <div className="space-y-2">
                <div className="text-sm font-semibold text-neutral-900 font-display">
                  Autonomous Disaster Relief Mesh Network
                </div>
                <p className="text-xs text-neutral-500 font-body leading-relaxed">
                  Decentralized ad-hoc telemetry and peer-to-peer messaging protocol designed for emergency first responders during infrastructure collapse.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-neutral-100 text-center font-mono">
                <div className="p-2 rounded-xl bg-neutral-50 border border-neutral-200/60">
                  <div className="text-[10px] text-neutral-400 uppercase">Faculty Score</div>
                  <div className="text-xs font-bold text-neutral-900 mt-0.5">9.8 / 10</div>
                </div>
                <div className="p-2 rounded-xl bg-neutral-50 border border-neutral-200/60">
                  <div className="text-[10px] text-neutral-400 uppercase">Contributions</div>
                  <div className="text-xs font-bold text-neutral-900 mt-0.5">340 Commits</div>
                </div>
                <div className="p-2 rounded-xl bg-neutral-50 border border-neutral-200/60">
                  <div className="text-[10px] text-neutral-400 uppercase">Lineage</div>
                  <div className="text-xs font-bold text-neutral-900 mt-0.5">v3 Active</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 2. PROJECT LINEAGE SECTION */}
        <div id="project-lineage" className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Visual Preview of Lineage Flow */}
          <div className="lg:col-span-6 order-2 lg:order-1">
            <div className="bg-white rounded-3xl border border-neutral-200/90 p-6 sm:p-7 shadow-xs space-y-6">
              <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
                <span className="text-xs font-mono font-medium text-neutral-500">Multi-Batch Continuity Chain</span>
                <span className="text-xs font-mono text-neutral-400">3 Batches Recorded</span>
              </div>

              {/* Lineage Steps: 2026 -> 2027 -> 2028 */}
              <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-neutral-200">
                <div className="relative">
                  <div className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-neutral-400 border-2 border-white ring-2 ring-neutral-200"></div>
                  <div className="text-xs font-mono font-bold text-neutral-900">Batch 2025–2026 • Foundation</div>
                  <p className="text-xs text-neutral-500 font-body mt-0.5">Core LoRa peer protocol & hardware benchmark validation.</p>
                </div>

                <div className="relative">
                  <div className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-[#e8860a] border-2 border-white ring-2 ring-[#fddfa0]"></div>
                  <div className="text-xs font-mono font-bold text-neutral-900">Batch 2026–2027 • In Flight</div>
                  <p className="text-xs text-neutral-500 font-body mt-0.5">Automated packet encryption and drone relay integration.</p>
                </div>

                <div className="relative">
                  <div className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-neutral-900 border-2 border-white ring-2 ring-neutral-300"></div>
                  <div className="text-xs font-mono font-bold text-neutral-900">Batch 2027–2028 • Scheduled Roadmap</div>
                  <p className="text-xs text-neutral-500 font-body mt-0.5">Satellite uplink handoff & enterprise disaster simulation.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 space-y-4 order-1 lg:order-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-100 border border-neutral-200 text-xs font-mono text-neutral-800">
              <GitBranch size={14} />
              <span>Cross-Batch Innovation Capital</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-display font-light tracking-tight text-neutral-900 leading-tight">
              Project <span className="font-normal italic text-[#e8860a]">Lineage</span>
            </h2>
            <p className="text-base text-neutral-600 font-body leading-relaxed">
              When students graduate, their work shouldn't gather digital dust. Project Lineage allows downstream junior batches 
              and cross-campus teams to fork verified foundations with architectural context intact—preventing year-after-year 
              wheel-reinvention.
            </p>
            <div className="pt-2 flex flex-wrap gap-2 text-xs font-mono text-neutral-600">
              <span className="px-2.5 py-1 rounded-md bg-white border border-neutral-200">Fork With Heritage</span>
              <span className="px-2.5 py-1 rounded-md bg-white border border-neutral-200">Historical Benchmarks</span>
              <span className="px-2.5 py-1 rounded-md bg-white border border-neutral-200">Handoff Protocols</span>
            </div>
          </div>
        </div>

        {/* 3. PROOF OF WORK SECTION */}
        <div id="proof-of-work" className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          <div className="lg:col-span-6 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-100 border border-neutral-200 text-xs font-mono text-neutral-800">
              <ShieldCheck size={14} />
              <span>Verifiable Academic Transcripts</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-display font-light tracking-tight text-neutral-900 leading-tight">
              Proof of <span className="font-normal italic text-[#e8860a]">Work</span>
            </h2>
            <p className="text-base text-neutral-600 font-body leading-relaxed">
              Replace unverified resume claims with cryptographic telemetry, institutional rubric attestations, 
              and faculty mentor signoffs recognized by academic committees and industry hiring partners.
            </p>
            <div className="pt-2 flex flex-wrap gap-2 text-xs font-mono text-neutral-600">
              <span className="px-2.5 py-1 rounded-md bg-white border border-neutral-200">Faculty Attestation</span>
              <span className="px-2.5 py-1 rounded-md bg-white border border-neutral-200">Code Telemetry</span>
              <span className="px-2.5 py-1 rounded-md bg-white border border-neutral-200">Institutional Ledger</span>
            </div>
          </div>

          {/* Visual Preview of Proof of Work */}
          <div className="lg:col-span-6">
            <div className="bg-white rounded-3xl border border-neutral-200/90 p-6 sm:p-7 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Award className="text-[#e8860a]" size={18} />
                  <span className="text-xs font-mono font-semibold text-neutral-900">VERIFIED PROOF RECORD</span>
                </div>
                <span className="text-[11px] font-mono text-neutral-400">#POW-9042</span>
              </div>

              <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200/70 space-y-3 font-mono text-xs">
                <div className="flex items-center justify-between text-neutral-600">
                  <span>Git Telemetry Verified</span>
                  <span className="text-emerald-700 font-semibold">Passed 100%</span>
                </div>
                <div className="flex items-center justify-between text-neutral-600">
                  <span>Faculty Rubric Evaluation</span>
                  <span className="text-emerald-700 font-semibold">Score: 9.8/10</span>
                </div>
                <div className="flex items-center justify-between text-neutral-600">
                  <span>HOD Department Endorsement</span>
                  <span className="text-emerald-700 font-semibold">Endorsed</span>
                </div>
              </div>

              <p className="text-xs text-neutral-500 font-body leading-relaxed">
                Proof of Work packages are exportable, shareable with recruitment authorities, and permanently verifiable on ProjectVerse.
              </p>
            </div>
          </div>
        </div>

        {/* 4. CALL TO ACTION SECTION */}
        <div className="rounded-3xl bg-neutral-900 text-white p-8 sm:p-12 text-center space-y-5">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-light tracking-tight">
            Ready to give your academic projects <span className="font-normal italic text-[#fddfa0]">longevity</span>?
          </h2>
          <p className="text-xs sm:text-sm text-neutral-300 max-w-xl mx-auto font-body leading-relaxed">
            Sign up to create your role-based profile, submit projects, and access collaborative workspaces, mentoring, and verification.
          </p>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            {onGetStarted && (
              <button
                onClick={onGetStarted}
                className="px-6 py-3 rounded-full bg-white text-neutral-900 text-sm font-semibold hover:bg-neutral-100 transition-all cursor-pointer"
              >
                Get Started
              </button>
            )}
            {onSignIn && (
              <button
                onClick={onSignIn}
                className="px-6 py-3 rounded-full border border-neutral-700 text-white text-sm font-medium hover:bg-neutral-800 transition-all cursor-pointer"
              >
                Sign In
              </button>
            )}
          </div>
        </div>

      </div>
    </section>
  );
};

export default InformationalProjectFeatures;
