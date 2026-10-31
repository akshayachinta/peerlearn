import React, { useState, useEffect, useCallback } from 'react';
import { storage } from './services/storage';
import { Student, StudentSkill } from './types';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { LandingPage } from './components/LandingPage';
import { StudentDashboard } from './components/StudentDashboard';
import { SmartMatching } from './components/SmartMatching';
import { TalentProfiles } from './components/TalentProfiles';
import { MySkills } from './components/MySkills';
import { SkillCategories } from './components/SkillCategories';
import { ExchangeRequests } from './components/ExchangeRequests';
import { LearningSessions } from './components/LearningSessions';
import { ActivityFeed } from './components/ActivityFeed';
import { AdminDashboard } from './components/AdminDashboard';
import { AuthModal } from './components/AuthModal';
import { DevOpsModal } from './components/DevOpsModal';
import { SendRequestModal } from './components/SendRequestModal';
import { ScheduleSessionModal } from './components/ScheduleSessionModal';
import { StudentProfileModal } from './components/StudentProfileModal';
import { EditProfileModal } from './components/EditProfileModal';

interface BackendStudent {
  id: number | string;
  fullName: string;
  email: string;
  collegeName: string;
  branch: string;
  academicYear: string;
  profilePhoto?: string | null;
  bio?: string | null;
  availability?: string;
  rating?: number;
  reviewCount?: number;
  xpPoints?: number;
  completedSessionsCount?: number;
  active?: boolean;
  createdAt?: string;
  skills?: Array<{
    id: number | string;
    skillName: string;
    category: string;
    proficiency: string;
    type: string;
    yearsExperienceOrGoal?: string;
    experienceOrGoal?: string;
  }>;
  achievements?: string[];
}

const mapBackendStudent = (student: BackendStudent): Student => ({
  id: String(student.id),
  name: student.fullName,
  email: student.email,
  collegeName: student.collegeName,
  branch: student.branch,
  academicYear: student.academicYear,
  avatarUrl: student.profilePhoto || undefined,
  bio: student.bio || '',
  availability: (student.availability || 'Available') as Student['availability'],
  rating: student.rating ?? 5,
  reviewCount: student.reviewCount ?? 0,
  xpPoints: student.xpPoints ?? 100,
  completedSessionsCount: student.completedSessionsCount ?? 0,
  badges: student.achievements || [],
  status: student.active === false ? 'DEACTIVATED' : 'ACTIVE',
  createdAt: student.createdAt || new Date().toISOString(),
  skills: (student.skills || []).map((skill): StudentSkill => ({
    id: String(skill.id),
    skillName: skill.skillName,
    category: skill.category as StudentSkill['category'],
    proficiency: skill.proficiency as StudentSkill['proficiency'],
    type: skill.type as StudentSkill['type'],
    yearsExperienceOrGoal: skill.yearsExperienceOrGoal || skill.experienceOrGoal || '',
  })),
});

export default function App() {
  const [currentView, setCurrentView] = useState<string>('dashboard');
  const [currentStudent, setCurrentStudent] = useState<Student | null>(storage.getCurrentStudent());
  const [isAdmin, setIsAdmin] = useState<boolean>(storage.isAdmin());

  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'LOGIN' | 'REGISTER' | 'ADMIN'>('LOGIN');
  const [isDevOpsOpen, setIsDevOpsOpen] = useState(false);

  const [targetStudentForRequest, setTargetStudentForRequest] = useState<Student | null>(null);
  const [defaultTeachingSkill, setDefaultTeachingSkill] = useState<string>('');
  const [defaultLearningSkill, setDefaultLearningSkill] = useState<string>('');
  const [profileModalStudent, setProfileModalStudent] = useState<Student | null>(null);
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [schedulePeerId, setSchedulePeerId] = useState<string>('');
  const [scheduleSkill, setScheduleSkill] = useState<string>('');
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);

  const refreshState = useCallback(async () => {
    const savedId = localStorage.getItem('peerlearn_api_student_id');
    const savedRole = localStorage.getItem('peerlearn_api_role');

    if (savedRole === 'ROLE_ADMIN') {
      setIsAdmin(true);
      setCurrentStudent(null);
      return;
    }

    if (savedId) {
      try {
        const response = await fetch(`/api/students/${encodeURIComponent(savedId)}`, {
          method: 'GET',
          credentials: 'include',
          headers: { Accept: 'application/json' },
        });
        if (!response.ok) {
          throw new Error(`Unable to load student profile (${response.status})`);
        }
        const backendStudent = (await response.json()) as BackendStudent;
        const mappedStudent = mapBackendStudent(backendStudent);
        setCurrentStudent(mappedStudent);
        setIsAdmin(false);
        return;
      } catch (error) {
        console.error('Backend student profile could not be loaded:', error);
        setCurrentStudent(null);
        setIsAdmin(false);
        return;
      }
    }

    setCurrentStudent(storage.getCurrentStudent());
    setIsAdmin(storage.isAdmin());
  }, []);

  useEffect(() => {
    void refreshState();
  }, [refreshState]);

  const handleOpenAuth = (mode: 'LOGIN' | 'REGISTER' | 'ADMIN') => {
    setAuthMode(mode);
    setIsAuthOpen(true);
  };

  const handleAuthSuccess = (role: 'STUDENT' | 'ADMIN') => {
    if (role === 'ADMIN') {
      setIsAdmin(true);
      setCurrentStudent(null);
      setCurrentView('admin');
    } else {
      setIsAdmin(false);
      setCurrentView('dashboard');
      void refreshState();
    }
  };

  const handleConnectWithStudent = (student: Student, teachSkill?: string, learnSkill?: string) => {
    setTargetStudentForRequest(student);
    setDefaultTeachingSkill(teachSkill || '');
    setDefaultLearningSkill(learnSkill || '');
  };

  const handleScheduleSession = (peerId?: string, defaultSkill?: string) => {
    setSchedulePeerId(peerId || '');
    setScheduleSkill(defaultSkill || '');
    setIsScheduleOpen(true);
  };

  if (currentView === 'admin') {
    if (!isAdmin) {
      return (
        <div className="min-h-screen bg-[#F8F7FC] flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-gray-100 p-8 text-center">
            <div className="w-16 h-16 bg-[#FEE2E2] text-[#E05252] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xs">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <span className="inline-block px-2.5 py-1 rounded-full bg-[#FEE2E2] text-[#E05252] text-[11px] font-bold uppercase tracking-wider mb-2">Admin Access Only</span>
            <h2 className="text-xl font-extrabold text-[#202033] mb-2">Restricted Area</h2>
            <p className="text-xs text-[#77758A] mb-6 leading-relaxed">The PeerLearn Admin Dashboard is accessible only to verified administrators. Students and unauthenticated users cannot view administrative metrics, manage users, or review system audits.</p>
            <div className="flex flex-col gap-2.5">
              <button onClick={() => handleOpenAuth('ADMIN')} className="w-full py-2.5 px-4 bg-[#5425A8] hover:bg-[#431D86] text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-[#5425A8]/20 cursor-pointer">Sign In with Administrator Credentials</button>
              <button onClick={() => setCurrentView('dashboard')} className="w-full py-2.5 px-4 bg-gray-100 hover:bg-gray-200 text-[#202033] rounded-xl text-xs font-semibold transition-all cursor-pointer">Return to Student Dashboard</button>
            </div>
          </div>
          <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} initialMode={authMode} onSuccess={handleAuthSuccess} />
        </div>
      );
    }

    return <><AdminDashboard onBackToStudentPortal={() => setCurrentView('dashboard')} onAdminLogout={() => { localStorage.removeItem('peerlearn_api_student'); localStorage.removeItem('peerlearn_api_student_id'); localStorage.removeItem('peerlearn_api_role'); storage.setAdmin(false); setIsAdmin(false); setCurrentView('landing'); }} /><DevOpsModal isOpen={isDevOpsOpen} onClose={() => setIsDevOpsOpen(false)} /></>;
  }

  if (currentView === 'landing') {
    return (
      <>
        <LandingPage onGetStarted={() => { if (currentStudent) setCurrentView('dashboard'); else handleOpenAuth('REGISTER'); }} onExploreSkills={() => setCurrentView('categories')} onOpenAuth={handleOpenAuth} onOpenDevOps={() => setIsDevOpsOpen(true)} />
        <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} initialMode={authMode} onSuccess={handleAuthSuccess} />
        <DevOpsModal isOpen={isDevOpsOpen} onClose={() => setIsDevOpsOpen(false)} />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F7FC] flex flex-col text-[#202033]">
      <Navbar currentStudent={currentStudent} isAdmin={isAdmin} onOpenAuth={handleOpenAuth} onOpenDevOps={() => setIsDevOpsOpen(true)} onNavigate={tab => setCurrentView(tab)} onStudentChanged={() => void refreshState()} onEditProfile={() => setIsEditProfileOpen(true)} />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <Sidebar currentTab={currentView} onNavigate={tab => setCurrentView(tab)} currentStudent={currentStudent} isAdmin={isAdmin} onStudentUpdated={() => void refreshState()} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {currentView === 'dashboard' && <StudentDashboard currentStudent={currentStudent} onNavigate={tab => setCurrentView(tab)} onConnect={handleConnectWithStudent} onViewProfile={student => setProfileModalStudent(student)} onScheduleSession={() => handleScheduleSession()} onOpenAddSkill={() => setCurrentView('my-skills')} onCompleteSession={() => void refreshState()} onEditProfile={() => setIsEditProfileOpen(true)} />}
          {currentView === 'matches' && <SmartMatching currentStudent={currentStudent} onConnect={handleConnectWithStudent} onViewProfile={student => setProfileModalStudent(student)} />}
          {currentView === 'profiles' && <TalentProfiles currentStudent={currentStudent} onConnect={student => handleConnectWithStudent(student)} onViewProfile={student => setProfileModalStudent(student)} />}
          {currentView === 'my-skills' && <MySkills currentStudent={currentStudent} onStudentUpdated={() => void refreshState()} />}
          {currentView === 'categories' && <SkillCategories onSelectCategory={() => setCurrentView('profiles')} />}
          {currentView === 'requests' && <ExchangeRequests currentStudent={currentStudent} onScheduleSession={handleScheduleSession} onRequestsUpdated={() => void refreshState()} />}
          {currentView === 'sessions' && <LearningSessions currentStudent={currentStudent} onOpenScheduler={() => handleScheduleSession()} onSessionsUpdated={() => void refreshState()} />}
          {currentView === 'activity' && <ActivityFeed />}
        </main>
      </div>

      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} initialMode={authMode} onSuccess={handleAuthSuccess} />
      <DevOpsModal isOpen={isDevOpsOpen} onClose={() => setIsDevOpsOpen(false)} />
      <SendRequestModal isOpen={Boolean(targetStudentForRequest)} onClose={() => setTargetStudentForRequest(null)} targetStudent={targetStudentForRequest} defaultTeachingSkill={defaultTeachingSkill} defaultLearningSkill={defaultLearningSkill} onRequestSent={() => { void refreshState(); setCurrentView('requests'); }} />
      <ScheduleSessionModal isOpen={isScheduleOpen} onClose={() => setIsScheduleOpen(false)} preselectedPeerId={schedulePeerId} defaultSkillName={scheduleSkill} onSessionScheduled={() => { void refreshState(); setCurrentView('sessions'); }} />
      <StudentProfileModal isOpen={Boolean(profileModalStudent)} onClose={() => setProfileModalStudent(null)} student={profileModalStudent} onConnect={student => handleConnectWithStudent(student)} />
      <EditProfileModal isOpen={isEditProfileOpen} onClose={() => setIsEditProfileOpen(false)} student={currentStudent} onProfileUpdated={() => void refreshState()} />
    </div>
  );
}
