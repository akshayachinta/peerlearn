import React from 'react';
import {
  Sparkles,
  Award,
  Users,
  Calendar,
  ArrowRight,
  CheckCircle2,
  Clock,
  Video,
  MapPin,
  TrendingUp,
  AlertCircle,
  Plus,
  Repeat,
  Megaphone,
  Star
} from 'lucide-react';
import { Student, ExchangeRequest, LearningSession, ActivityLog } from '../types';
import { storage } from '../services/storage';

interface StudentDashboardProps {
  currentStudent: Student | null;
  onNavigate: (tab: string) => void;
  onConnect: (student: Student, teachSkill?: string, learnSkill?: string) => void;
  onViewProfile: (student: Student) => void;
  onScheduleSession: () => void;
  onOpenAddSkill: () => void;
  onCompleteSession: (session: LearningSession) => void;
  onEditProfile?: () => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  currentStudent,
  onNavigate,
  onConnect,
  onViewProfile,
  onScheduleSession,
  onOpenAddSkill,
  onCompleteSession,
  onEditProfile,
}) => {
  if (!currentStudent) return null;

  const matches = storage.getMatchesForStudent(currentStudent.id);
  const mutualMatches = matches.filter(m => m.matchType === 'MUTUAL');
  const topMutualMatch = mutualMatches[0];

  const requests = storage.getRequestsForStudent(currentStudent.id);
  const sessions = storage.getSessionsForStudent(currentStudent.id);
  const activities = storage.getActivities(5);
  const announcements = storage.getAnnouncements();
  const allSkills = storage.getAllSkills();

  // Profile completion calculation:
  // Teach skills (at least 2) = 30%, Learn skills (at least 2) = 30%, Bio = 20%, College & Branch = 20%
  const teachCount = currentStudent.skills.filter(s => s.type === 'TEACH').length;
  const learnCount = currentStudent.skills.filter(s => s.type === 'LEARN').length;
  let completionScore = 20; // baseline college
  if (currentStudent.bio) completionScore += 20;
  if (teachCount >= 1) completionScore += 15;
  if (teachCount >= 2) completionScore += 15;
  if (learnCount >= 1) completionScore += 15;
  if (learnCount >= 2) completionScore += 15;
  completionScore = Math.min(100, completionScore);

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-[#5425A8] via-[#7546D8] to-[#A78BFA] rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-[#E9DDFC] text-xs font-semibold backdrop-blur-sm">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Campus Skill Exchange Active</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome back, {currentStudent.name.split(' ')[0]}!
            </h1>
            <p className="text-xs sm:text-sm text-[#E9DDFC] max-w-xl leading-relaxed">
              You are ready to exchange skills with peers at {currentStudent.collegeName}. You currently have{' '}
              <span className="font-bold text-white underline">{mutualMatches.length} mutual skill matches</span> waiting for connection.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => onNavigate('matches')}
              className="px-5 py-3 bg-white hover:bg-[#F8F7FC] text-[#5425A8] text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
            >
              <Repeat className="w-4 h-4 text-[#7546D8]" />
              <span>View Mutual Matches</span>
            </button>
            <button
              onClick={onOpenAddSkill}
              className="px-4 py-3 bg-[#5425A8]/50 hover:bg-[#5425A8] text-white border border-white/20 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Skill</span>
            </button>
          </div>
        </div>
      </div>

      {/* Campus Announcements (if any) */}
      {announcements.length > 0 && (
        <div className="bg-[#FAF9FD] border border-[#E9DDFC] rounded-2xl p-4 flex items-start gap-3">
          <div className="w-8 h-8 rounded-xl bg-[#7546D8] text-white flex items-center justify-center shrink-0 mt-0.5">
            <Megaphone className="w-4 h-4" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#202033]">{announcements[0].title}</span>
              <span className="text-[10px] font-semibold bg-[#E9DDFC] text-[#5425A8] px-2 py-0.2 rounded-md">
                Campus Announcement
              </span>
            </div>
            <p className="text-xs text-[#77758A] mt-0.5 leading-relaxed">
              {announcements[0].content}
            </p>
          </div>
        </div>
      )}

      {/* 4 Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Available Skills */}
        <div
          onClick={() => onNavigate('categories')}
          className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs hover:border-[#E9DDFC] hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-[#77758A] uppercase tracking-wider">
              Total Skills
            </span>
            <div className="w-9 h-9 rounded-xl bg-[#FAF9FD] text-[#7546D8] flex items-center justify-center group-hover:scale-110 transition-transform">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-[#202033] font-mono tabular-nums">
            {allSkills.length}
          </p>
          <p className="text-[11px] text-[#77758A] mt-1 flex items-center gap-1">
            <span>Across 7 categories</span>
            <span className="text-[#16A36A] font-semibold">· Cataloged</span>
          </p>
        </div>

        {/* My Skill Matches */}
        <div
          onClick={() => onNavigate('matches')}
          className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs hover:border-[#E9DDFC] hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-[#77758A] uppercase tracking-wider">
              My Skill Matches
            </span>
            <div className="w-9 h-9 rounded-xl bg-[#E9DDFC] text-[#5425A8] flex items-center justify-center group-hover:scale-110 transition-transform">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-[#5425A8] font-mono tabular-nums">
            {mutualMatches.length}
          </p>
          <p className="text-[11px] text-[#77758A] mt-1 flex items-center gap-1">
            <span className="text-[#7546D8] font-bold">100% Reciprocal</span>
            <span>matches</span>
          </p>
        </div>

        {/* Pending Requests */}
        <div
          onClick={() => onNavigate('requests')}
          className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs hover:border-[#E9DDFC] hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-[#77758A] uppercase tracking-wider">
              Pending Requests
            </span>
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-[#7546D8] flex items-center justify-center group-hover:scale-110 transition-transform">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-[#202033] font-mono tabular-nums">
            {requests.incoming.length}
          </p>
          <p className="text-[11px] text-[#77758A] mt-1">
            {requests.sent.length} sent requests pending
          </p>
        </div>

        {/* Completed Sessions */}
        <div
          onClick={() => onNavigate('sessions')}
          className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs hover:border-[#E9DDFC] hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-[#77758A] uppercase tracking-wider">
              Completed Sessions
            </span>
            <div className="w-9 h-9 rounded-xl bg-green-50 text-[#16A36A] flex items-center justify-center group-hover:scale-110 transition-transform">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-[#16A36A] font-mono tabular-nums">
            {currentStudent.completedSessionsCount}
          </p>
          <p className="text-[11px] text-[#77758A] mt-1">
            Earned <span className="font-bold text-[#5425A8] font-mono">{currentStudent.xpPoints} XP</span>
          </p>
        </div>
      </div>

      {/* Main Grid: Recommended Mutual Match Spotlight & Upcoming Sessions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 7 Columns: Top Mutual Skill Match Spotlight */}
        <div className="lg:col-span-7 space-y-6">
          {topMutualMatch && (
            <div className="bg-white rounded-3xl p-6 border border-[#A78BFA] shadow-sm relative overflow-hidden">
              <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#16A36A]" />
                  <span className="text-xs font-bold text-[#5425A8] uppercase tracking-wider">
                    Spotlight: Top Mutual Skill Match
                  </span>
                </div>
                <span className="text-xs font-bold bg-[#E9DDFC] text-[#5425A8] px-2.5 py-0.5 rounded-full flex items-center gap-1 font-mono">
                  <Sparkles className="w-3 h-3 text-[#7546D8]" />
                  <span>{topMutualMatch.matchPercentage}% Mutual Match</span>
                </span>
              </div>

              <div className="py-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-extrabold text-base shadow-md"
                      style={{ backgroundColor: topMutualMatch.student.avatarBg || '#7546D8' }}
                    >
                      {topMutualMatch.student.name.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-bold text-[#202033]">{topMutualMatch.student.name}</h3>
                        <span className="text-xs text-[#77758A]">({topMutualMatch.student.academicYear})</span>
                      </div>
                      <p className="text-xs text-[#77758A]">
                        {topMutualMatch.student.collegeName} · {topMutualMatch.student.branch}
                      </p>
                      <div className="flex items-center gap-2 text-[11px] text-amber-500 font-semibold mt-1">
                        <Star className="w-3 h-3 fill-current" />
                        <span>{topMutualMatch.student.rating.toFixed(1)} rating</span>
                        <span className="text-gray-400">· {topMutualMatch.student.completedSessionsCount} sessions completed</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Reciprocal Flow Visual */}
                <div className="my-4 p-4 bg-[#FAF9FD] rounded-2xl border border-gray-100 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-2.5 bg-white rounded-xl border border-green-100">
                    <span className="text-[10px] font-bold text-[#16A36A] uppercase tracking-wider block mb-1">
                      You Teach Them:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {topMutualMatch.whatYouTeachThem.map(s => (
                        <span key={s} className="px-2 py-0.5 bg-green-50 text-[#16A36A] rounded font-bold text-xs">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="p-2.5 bg-white rounded-xl border border-purple-100">
                    <span className="text-[10px] font-bold text-[#7546D8] uppercase tracking-wider block mb-1">
                      They Teach You:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {topMutualMatch.whatTheyTeachYou.map(s => (
                        <span key={s} className="px-2 py-0.5 bg-[#E9DDFC] text-[#5425A8] rounded font-bold text-xs">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    onClick={() => onViewProfile(topMutualMatch.student)}
                    className="px-4 py-2.5 text-xs font-semibold text-[#77758A] hover:bg-gray-100 rounded-xl transition-colors cursor-pointer"
                  >
                    View Full Profile
                  </button>
                  <button
                    onClick={() =>
                      onConnect(
                        topMutualMatch.student,
                        topMutualMatch.whatYouTeachThem[0],
                        topMutualMatch.whatTheyTeachYou[0]
                      )
                    }
                    className="px-5 py-2.5 bg-[#7546D8] hover:bg-[#5425A8] text-white text-xs font-bold rounded-xl shadow-md transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <Repeat className="w-3.5 h-3.5" />
                    <span>Propose Skill Exchange</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Upcoming Learning Sessions */}
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#7546D8]" />
                <h3 className="text-sm font-bold text-[#202033]">Upcoming Learning Sessions</h3>
              </div>
              <button
                onClick={() => onNavigate('sessions')}
                className="text-xs font-bold text-[#7546D8] hover:underline cursor-pointer"
              >
                View Calendar
              </button>
            </div>

            {sessions.upcoming.length === 0 ? (
              <div className="py-8 text-center text-xs text-[#77758A]">
                <Calendar className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                <p className="font-semibold text-[#202033]">No upcoming sessions scheduled</p>
                <p className="mt-1">Connect with an accepted peer to schedule a 1-on-1 session.</p>
                <button
                  onClick={onScheduleSession}
                  className="mt-3 px-4 py-2 bg-[#FAF9FD] text-[#5425A8] border border-[#E9DDFC] rounded-xl font-bold hover:bg-[#E9DDFC] transition-colors cursor-pointer"
                >
                  Schedule Session
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {sessions.upcoming.slice(0, 3).map(sess => {
                  const isMentor = sess.mentorId === currentStudent.id;
                  return (
                    <div
                      key={sess.id}
                      className="p-4 bg-[#F8F7FC] rounded-2xl border border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-[#202033]">{sess.skillName}</span>
                          <span
                            className={`text-[10px] px-2 py-0.5 rounded font-semibold ${
                              isMentor ? 'bg-green-100 text-[#16A36A]' : 'bg-[#E9DDFC] text-[#5425A8]'
                            }`}
                          >
                            {isMentor ? 'You are Teaching' : 'You are Learning'}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#77758A] mt-1 flex items-center gap-3">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-[#7546D8]" />
                            <span>{sess.date} at {sess.time} ({sess.durationMinutes}m)</span>
                          </span>
                          <span className="flex items-center gap-1">
                            {sess.mode === 'Online' ? <Video className="w-3 h-3" /> : <MapPin className="w-3 h-3" />}
                            <span>{sess.mode}</span>
                          </span>
                        </p>
                        <p className="text-[11px] text-gray-500 mt-0.5">
                          With {isMentor ? sess.learnerName : sess.mentorName}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {sess.mode === 'Online' && sess.meetingLinkOrVenue.startsWith('http') && (
                          <a
                            href={sess.meetingLinkOrVenue}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1.5 bg-[#FAF9FD] text-[#5425A8] border border-[#E9DDFC] rounded-lg text-xs font-semibold hover:bg-[#E9DDFC] transition-colors"
                          >
                            Join Meet
                          </a>
                        )}
                        <button
                          onClick={() => onCompleteSession(sess)}
                          className="px-3 py-1.5 bg-[#16A36A] hover:bg-green-700 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
                        >
                          Mark Complete
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right 5 Columns: Profile Completion & Campus Activity */}
        <div className="lg:col-span-5 space-y-6">
          {/* Profile Completion Box */}
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold text-[#202033] uppercase tracking-wider">
                Profile Completion
              </h3>
              <span className="text-xs font-mono font-extrabold text-[#7546D8]">
                {completionScore}%
              </span>
            </div>

            <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden mb-4">
              <div
                className="bg-gradient-to-r from-[#7546D8] to-[#16A36A] h-full rounded-full transition-all duration-500"
                style={{ width: `${completionScore}%` }}
              />
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between text-[#77758A]">
                <span>Skills You Teach ({teachCount}/2)</span>
                {teachCount >= 2 ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#16A36A]" />
                ) : (
                  <button onClick={onOpenAddSkill} className="text-[#7546D8] font-bold cursor-pointer hover:underline">
                    + Add
                  </button>
                )}
              </div>
              <div className="flex items-center justify-between text-[#77758A]">
                <span>Skills You Want to Learn ({learnCount}/2)</span>
                {learnCount >= 2 ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#16A36A]" />
                ) : (
                  <button onClick={onOpenAddSkill} className="text-[#7546D8] font-bold cursor-pointer hover:underline">
                    + Add
                  </button>
                )}
              </div>
              <div className="flex items-center justify-between text-[#77758A]">
                <span>Bio &amp; Academic Details</span>
                <CheckCircle2 className="w-3.5 h-3.5 text-[#16A36A]" />
              </div>
            </div>

            {onEditProfile && (
              <button
                onClick={onEditProfile}
                className="w-full mt-4 py-2 bg-[#FAF9FD] hover:bg-[#E9DDFC] text-[#5425A8] border border-[#E9DDFC] rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                Edit Profile Details
              </button>
            )}
          </div>

          {/* Recent Campus Activity */}
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
              <h3 className="text-xs font-bold text-[#202033] uppercase tracking-wider">
                Recent Campus Activity
              </h3>
              <button
                onClick={() => onNavigate('activity')}
                className="text-xs font-bold text-[#7546D8] hover:underline cursor-pointer"
              >
                View All
              </button>
            </div>

            <div className="space-y-3.5">
              {activities.map(act => (
                <div key={act.id} className="flex items-start gap-3 text-xs">
                  <div className="w-2 h-2 rounded-full bg-[#7546D8] mt-1.5 shrink-0" />
                  <div className="flex-1">
                    <p className="font-semibold text-[#202033]">{act.title}</p>
                    <p className="text-[11px] text-[#77758A] leading-tight">{act.description}</p>
                    <span className="text-[10px] text-gray-400 font-mono mt-0.5 block">
                      {act.timestamp}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
