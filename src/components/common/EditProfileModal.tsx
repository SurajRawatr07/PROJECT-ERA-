import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  CheckCircle2, 
  Save, 
  Building2, 
  GraduationCap, 
  Code2, 
  FlaskConical, 
  Briefcase, 
  User, 
  Github, 
  Linkedin, 
  Globe 
} from 'lucide-react';
import { UserProfile, UserRole } from '../../types';
import { updateStoredProfile, getCurrentSession } from '../../lib/authService';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  role: UserRole;
  onProfileUpdated: (updatedProfile: UserProfile) => void;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  isOpen,
  onClose,
  profile,
  role,
  onProfileUpdated
}) => {
  const [fullName, setFullName] = useState(profile.fullName || '');
  const [bio, setBio] = useState(profile.bio || '');
  const [avatar, setAvatar] = useState(profile.avatar || '');

  // Student fields
  const [institution, setInstitution] = useState(profile.institution || '');
  const [department, setDepartment] = useState(profile.department || '');
  const [course, setCourse] = useState(profile.course || profile.program || '');
  const [batch, setBatch] = useState(profile.batch || '');
  const [rollNumber, setRollNumber] = useState(profile.rollNumber || '');
  const [skillsStr, setSkillsStr] = useState((profile.skills || []).join(', '));

  // Alumni fields
  const [graduationYear, setGraduationYear] = useState(profile.graduationYear || '2024');
  const [currentCompany, setCurrentCompany] = useState(profile.currentOrganization || '');
  const [currentJobRole, setCurrentJobRole] = useState(profile.currentJobRole || '');

  // Developer fields
  const [specialization, setSpecialization] = useState(profile.skills?.[0] || 'Full-Stack Software Architect');
  const [githubUsername, setGithubUsername] = useState(profile.githubUsername || profile.githubHandle || '');
  const [portfolio, setPortfolio] = useState(profile.portfolio || '');

  // Researcher fields
  const [designation, setDesignation] = useState(profile.designation || '');
  const [researchDomain, setResearchDomain] = useState(profile.researchAreas?.[0] || 'Edge AI & Systems');
  const [googleScholarUrl, setGoogleScholarUrl] = useState(profile.googleScholarUrl || '');

  // Faculty fields
  const [facultyId, setFacultyId] = useState(profile.facultyId || '');

  // Institution fields
  const [website, setWebsite] = useState(profile.website || '');
  const [institutionType, setInstitutionType] = useState(profile.institutionType || 'University');
  const [address, setAddress] = useState(profile.address || '');

  // Industry fields
  const [industrySector, setIndustrySector] = useState('Enterprise Cloud Infrastructure');

  const [isSaved, setIsSaved] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const skills = skillsStr.split(',').map(s => s.trim()).filter(Boolean);

    const updated: UserProfile = {
      ...profile,
      fullName,
      bio,
      avatar,
      skills: skills.length > 0 ? skills : profile.skills,
      institution: institution || profile.institution,
      department: department || profile.department,
      course: course || profile.course,
      batch: batch || profile.batch,
      rollNumber: rollNumber || profile.rollNumber,
      graduationYear: graduationYear || profile.graduationYear,
      currentOrganization: currentCompany || profile.currentOrganization,
      currentJobRole: currentJobRole || profile.currentJobRole,
      githubUsername: githubUsername || profile.githubUsername,
      githubHandle: githubUsername || profile.githubHandle,
      portfolio: portfolio || profile.portfolio,
      designation: designation || profile.designation,
      facultyId: facultyId || profile.facultyId,
      website: website || profile.website,
      institutionType: institutionType || profile.institutionType,
      address: address || profile.address,
      researchAreas: researchDomain ? [researchDomain] : profile.researchAreas
    };

    updateStoredProfile(updated);
    onProfileUpdated(updated);
    setIsSaved(true);

    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-black/10 overflow-hidden my-8"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-black/8 bg-[#FBFBFA]">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-neutral-900 flex items-center gap-2">
              <span>Edit {role === 'INSTITUTION' ? 'Institution Profile' : `${role} Profile`}</span>
            </h2>
            <p className="text-xs text-neutral-500">
              Update only the fields relevant to your {role} identity on ProjectVerse.
            </p>
          </div>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-neutral-200/70 text-neutral-400 hover:text-neutral-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Identity Header */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-neutral-800 mb-1">
                {role === 'INSTITUTION' ? 'Institution Name' : 'Full Name'} *
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-neutral-300 text-xs text-neutral-900"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-neutral-800 mb-1">
                Short Bio / Statement
              </label>
              <textarea
                rows={2}
                value={bio}
                onChange={e => setBio(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-neutral-300 text-xs text-neutral-900"
              />
            </div>
          </div>

          {/* Student Specific Fields */}
          {role === 'STUDENT' && (
            <div className="pt-3 border-t border-neutral-100 space-y-3">
              <h3 className="text-xs font-bold text-neutral-400 uppercase font-mono">Academic Fields</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-800 mb-1">Institution</label>
                  <input
                    type="text"
                    value={institution}
                    onChange={e => setInstitution(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-800 mb-1">Department</label>
                  <input
                    type="text"
                    value={department}
                    onChange={e => setDepartment(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-800 mb-1">Course / Degree</label>
                  <input
                    type="text"
                    value={course}
                    onChange={e => setCourse(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-800 mb-1">Roll / Enrollment Number</label>
                  <input
                    type="text"
                    value={rollNumber}
                    onChange={e => setRollNumber(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-xs"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-neutral-800 mb-1">Skills (comma separated)</label>
                  <input
                    type="text"
                    value={skillsStr}
                    onChange={e => setSkillsStr(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-xs"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Alumni Specific Fields */}
          {role === 'ALUMNI' && (
            <div className="pt-3 border-t border-neutral-100 space-y-3">
              <h3 className="text-xs font-bold text-neutral-400 uppercase font-mono">Alumni Professional Fields</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-800 mb-1">Graduation Year</label>
                  <input
                    type="text"
                    value={graduationYear}
                    onChange={e => setGraduationYear(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-800 mb-1">Current Company</label>
                  <input
                    type="text"
                    value={currentCompany}
                    onChange={e => setCurrentCompany(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-800 mb-1">Current Job Role</label>
                  <input
                    type="text"
                    value={currentJobRole}
                    onChange={e => setCurrentJobRole(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-800 mb-1">Alumni Alma Mater</label>
                  <input
                    type="text"
                    value={institution}
                    onChange={e => setInstitution(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-xs"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Developer Specific Fields */}
          {role === 'DEVELOPER' && (
            <div className="pt-3 border-t border-neutral-100 space-y-3">
              <h3 className="text-xs font-bold text-neutral-400 uppercase font-mono">Technical & Developer Fields</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-800 mb-1">Specialization</label>
                  <input
                    type="text"
                    value={specialization}
                    onChange={e => setSpecialization(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-800 mb-1">GitHub Username</label>
                  <input
                    type="text"
                    value={githubUsername}
                    onChange={e => setGithubUsername(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-xs"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-neutral-800 mb-1">Portfolio / Personal Site</label>
                  <input
                    type="url"
                    value={portfolio}
                    onChange={e => setPortfolio(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-xs"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Researcher Specific Fields */}
          {role === 'RESEARCHER' && (
            <div className="pt-3 border-t border-neutral-100 space-y-3">
              <h3 className="text-xs font-bold text-neutral-400 uppercase font-mono">Research Credentials</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-800 mb-1">Research Institution</label>
                  <input
                    type="text"
                    value={institution}
                    onChange={e => setInstitution(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-800 mb-1">Designation</label>
                  <input
                    type="text"
                    value={designation}
                    onChange={e => setDesignation(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-800 mb-1">Research Domain</label>
                  <input
                    type="text"
                    value={researchDomain}
                    onChange={e => setResearchDomain(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-800 mb-1">ORCID / Google Scholar</label>
                  <input
                    type="text"
                    value={googleScholarUrl}
                    onChange={e => setGoogleScholarUrl(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-xs"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Faculty / HOD Specific Fields */}
          {(role === 'FACULTY' || role === 'HOD') && (
            <div className="pt-3 border-t border-neutral-100 space-y-3">
              <h3 className="text-xs font-bold text-neutral-400 uppercase font-mono">Academic Authority Fields</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-800 mb-1">Institution</label>
                  <input
                    type="text"
                    value={institution}
                    onChange={e => setInstitution(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-800 mb-1">Department</label>
                  <input
                    type="text"
                    value={department}
                    onChange={e => setDepartment(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-800 mb-1">Designation</label>
                  <input
                    type="text"
                    value={designation}
                    onChange={e => setDesignation(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-800 mb-1">Employee / Faculty ID</label>
                  <input
                    type="text"
                    value={facultyId}
                    onChange={e => setFacultyId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-xs"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Institution Specific Fields */}
          {role === 'INSTITUTION' && (
            <div className="pt-3 border-t border-neutral-100 space-y-3">
              <h3 className="text-xs font-bold text-neutral-400 uppercase font-mono">Institution Node Fields</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-800 mb-1">Institution Type</label>
                  <input
                    type="text"
                    value={institutionType}
                    onChange={e => setInstitutionType(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-800 mb-1">Official Website</label>
                  <input
                    type="url"
                    value={website}
                    onChange={e => setWebsite(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-xs"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-neutral-800 mb-1">Campus Address</label>
                  <input
                    type="text"
                    value={address}
                    onChange={e => setAddress(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-xs"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Industry Specific Fields */}
          {role === 'INDUSTRY_PROFESSIONAL' && (
            <div className="pt-3 border-t border-neutral-100 space-y-3">
              <h3 className="text-xs font-bold text-neutral-400 uppercase font-mono">Industry Enterprise Fields</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-800 mb-1">Enterprise Company</label>
                  <input
                    type="text"
                    value={currentCompany}
                    onChange={e => setCurrentCompany(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-800 mb-1">Job Title</label>
                  <input
                    type="text"
                    value={currentJobRole}
                    onChange={e => setCurrentJobRole(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-xs"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-neutral-800 mb-1">Industry Sector</label>
                  <input
                    type="text"
                    value={industrySector}
                    onChange={e => setIndustrySector(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-xs"
                  />
                </div>
              </div>
            </div>
          )}

          <div className="pt-4 border-t border-neutral-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-neutral-300 text-xs font-semibold text-neutral-700 hover:bg-neutral-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-xl bg-neutral-900 text-white text-xs font-semibold hover:bg-neutral-800 flex items-center gap-1.5"
            >
              {isSaved ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Profile Saved!</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default EditProfileModal;
