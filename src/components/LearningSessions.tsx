import React, { useState } from 'react';
import {
  CalendarDays,
  Plus,
  Clock,
  Video,
  MapPin,
  CheckCircle2,
  XCircle,
  Star,
  ExternalLink,
  MessageSquare,
  Sparkles,
  Award
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Student, LearningSession } from '../types';
import { storage } from '../services/storage';

interface LearningSessionsProps {
  currentStudent: Student | null;
  onOpenScheduler: () => void;
  onSessionsUpdated: () => void;
}

export const LearningSessions: React.FC<LearningSessionsProps> = ({
  currentStudent,
  onOpenScheduler,
  onSessionsUpdated,
}) => {
  const [tab, setTab] = useState<'UPCOMING' | 'COMPLETED'>('UPCOMING');
  const [completingSession, setCompletingSession] = useState<LearningSession | null>(null);
  const [rating, setRating] = useState(5);
  const [feedbackNote, setFeedbackNote] = useState('');

  if (!currentStudent) return null;

  const { upcoming, completed } = storage.getSessionsForStudent(currentStudent.id);

  const handleConfirmComplete = () => {
    if (!completingSession) return;

    storage.completeSession(completingSession.id, rating, feedbackNote);
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });

    setCompletingSession(null);
    setFeedbackNote('');
    setRating(5);
    onSessionsUpdated();
  };

  const handleCancelSession = (sessionId: string) => {
    storage.cancelSession(sessionId);
    onSessionsUpdated();
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <CalendarDays className="w-5 h-5 text-[#7546D8]" />
            <h1 className="text-xl font-extrabold text-[#202033]">Learning Sessions</h1>
          </div>
          <p className="text-xs text-[#77758A]">
            Schedule and track structured 1-on-1 peer teaching exchanges. Completed sessions award +100 XP to the mentor!
          </p>
        </div>

        <button
          onClick={onOpenScheduler}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#7546D8] hover:bg-[#5425A8] text-white text-xs font-bold rounded-xl shadow-md transition-all self-start md:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Schedule New Session</span>
        </button>
      </div>

      {/* Segmented Filter */}
      <div className="flex items-center gap-2 p-1.5 bg-white rounded-2xl border border-gray-100 shadow-xs max-w-sm">
        <button
          onClick={() => setTab('UPCOMING')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 ${
            tab === 'UPCOMING'
              ? 'bg-[#7546D8] text-white shadow-sm'
              : 'text-[#77758A] hover:text-[#202033]'
          }`}
        >
          <span>Upcoming ({upcoming.length})</span>
        </button>
        <button
          onClick={() => setTab('COMPLETED')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 ${
            tab === 'COMPLETED'
              ? 'bg-[#16A36A] text-white shadow-sm'
              : 'text-[#77758A] hover:text-[#202033]'
          }`}
        >
          <span>Completed ({completed.length})</span>
        </button>
      </div>

      {/* Sessions Grid */}
      {tab === 'UPCOMING' && (
        <div className="space-y-4">
          {upcoming.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 space-y-3">
              <CalendarDays className="w-10 h-10 text-gray-300 mx-auto" />
              <h3 className="text-sm font-bold text-[#202033]">No upcoming learning sessions</h3>
              <p className="text-xs text-[#77758A] max-w-md mx-auto">
                Schedule a session with one of your accepted peer connections to practice coding, system design, or interview aptitude.
              </p>
              <button
                onClick={onOpenScheduler}
                className="mt-2 px-4 py-2 bg-[#FAF9FD] text-[#5425A8] border border-[#E9DDFC] rounded-xl text-xs font-bold hover:bg-[#E9DDFC] transition-colors cursor-pointer"
              >
                Schedule First Session
              </button>
            </div>
          ) : (
            upcoming.map(sess => {
              const isMentor = sess.mentorId === currentStudent.id;
              const peerName = isMentor ? sess.learnerName : sess.mentorName;

              return (
                <div
                  key={sess.id}
                  className="bg-white rounded-2xl p-6 border border-gray-100 shadow-xs hover:border-[#E9DDFC] transition-all flex flex-col md:flex-row md:items-center justify-between gap-5"
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-2.5">
                      <h3 className="text-base font-bold text-[#202033]">{sess.skillName}</h3>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          isMentor ? 'bg-green-100 text-[#16A36A]' : 'bg-[#E9DDFC] text-[#5425A8]'
                        }`}
                      >
                        {isMentor ? 'You are Teaching' : 'You are Learning'}
                      </span>
                      <span className="text-xs text-[#77758A]">with {peerName}</span>
                    </div>

                    <p className="text-xs text-[#77758A] leading-relaxed">
                      {sess.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-4 text-xs pt-1">
                      <span className="flex items-center gap-1.5 font-semibold text-[#202033]">
                        <Clock className="w-3.5 h-3.5 text-[#7546D8]" />
                        <span>{sess.date} at {sess.time} ({sess.durationMinutes} minutes)</span>
                      </span>

                      <span className="flex items-center gap-1.5 text-[#77758A]">
                        {sess.mode === 'Online' ? <Video className="w-3.5 h-3.5 text-blue-500" /> : <MapPin className="w-3.5 h-3.5 text-amber-500" />}
                        <span>{sess.meetingLinkOrVenue}</span>
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    {sess.mode === 'Online' && sess.meetingLinkOrVenue.startsWith('http') && (
                      <a
                        href={sess.meetingLinkOrVenue}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3.5 py-2 bg-[#FAF9FD] text-[#5425A8] border border-[#E9DDFC] rounded-xl text-xs font-semibold hover:bg-[#E9DDFC] transition-colors flex items-center gap-1"
                      >
                        <span>Join</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                    <button
                      onClick={() => handleCancelSession(sess.id)}
                      className="px-3 py-2 text-xs font-semibold text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => setCompletingSession(sess)}
                      className="px-4 py-2 bg-[#16A36A] hover:bg-green-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Mark Complete (+100 XP)</span>
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {tab === 'COMPLETED' && (
        <div className="space-y-4">
          {completed.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-gray-100">
              <CheckCircle2 className="w-10 h-10 text-gray-300 mx-auto mb-2" />
              <p className="text-sm font-bold text-[#202033]">No completed sessions yet</p>
              <p className="text-xs text-[#77758A]">Completed sessions and mentor ratings will be recorded here.</p>
            </div>
          ) : (
            completed.map(sess => {
              const isMentor = sess.mentorId === currentStudent.id;
              const peerName = isMentor ? sess.learnerName : sess.mentorName;

              return (
                <div
                  key={sess.id}
                  className="bg-white rounded-2xl p-5 border border-gray-100 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-[#202033]">{sess.skillName}</span>
                      <span className="text-[10px] bg-green-100 text-[#16A36A] px-2 py-0.5 rounded-full font-bold">
                        Completed
                      </span>
                    </div>
                    <p className="text-xs text-[#77758A]">
                      Conducted with <span className="font-semibold text-[#202033]">{peerName}</span> on {sess.date}
                    </p>
                    {sess.notes && (
                      <p className="text-xs text-gray-600 italic mt-1 bg-[#FAF9FD] p-2 rounded-lg border border-gray-100">
                        "{sess.notes}"
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-4 text-xs font-semibold">
                    <div className="flex items-center gap-1 text-amber-500">
                      <Star className="w-4 h-4 fill-current" />
                      <span>{sess.mentorRating || 5}/5 Stars</span>
                    </div>
                    <div className="flex items-center gap-1 text-[#16A36A] font-mono">
                      <Award className="w-4 h-4" />
                      <span>+100 XP Earned</span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Complete Session Modal */}
      {completingSession && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-[#E9DDFC]">
            <div className="p-6 bg-gradient-to-r from-[#16A36A] to-teal-600 text-white">
              <div className="flex items-center gap-2 mb-1">
                <CheckCircle2 className="w-5 h-5 text-green-200" />
                <h3 className="text-base font-bold">Complete Learning Session</h3>
              </div>
              <p className="text-xs text-green-100">
                Verify session completion and award XP points to both participants.
              </p>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#202033] mb-2">
                  Rate this peer session:
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="p-1 text-amber-400 hover:scale-125 transition-transform cursor-pointer"
                    >
                      <Star className={`w-7 h-7 ${star <= rating ? 'fill-current' : 'text-gray-300'}`} />
                    </button>
                  ))}
                  <span className="text-xs font-bold text-[#202033] ml-2">{rating}/5 Stars</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#202033] mb-1">
                  Session Feedback Note
                </label>
                <textarea
                  rows={3}
                  value={feedbackNote}
                  onChange={e => setFeedbackNote(e.target.value)}
                  placeholder="What was covered? Any highlights or exercises completed?"
                  className="w-full p-3 text-xs border border-gray-200 rounded-xl focus:outline-none focus:border-[#16A36A]"
                />
              </div>

              <div className="p-3 bg-green-50 rounded-xl border border-green-200 text-xs text-green-800">
                <p className="font-bold flex items-center gap-1">
                  <Award className="w-3.5 h-3.5" />
                  <span>XP Award Rule</span>
                </p>
                <p className="text-[11px] mt-0.5">
                  The mentor receives +100 XP, and the learner receives +50 XP towards the campus leaderboard.
                </p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setCompletingSession(null)}
                  className="px-4 py-2 text-xs font-semibold text-[#77758A] hover:bg-gray-100 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmComplete}
                  className="px-5 py-2.5 bg-[#16A36A] hover:bg-green-700 text-white text-xs font-bold rounded-xl shadow-md cursor-pointer"
                >
                  Confirm &amp; Award XP
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
