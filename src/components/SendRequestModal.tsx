import React, { useState, useEffect } from 'react';
import { X, ArrowRightLeft, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { Student } from '../types';
import { storage } from '../services/storage';

interface SendRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetStudent: Student | null;
  defaultTeachingSkill?: string;
  defaultLearningSkill?: string;
  onRequestSent: () => void;
}

export const SendRequestModal: React.FC<SendRequestModalProps> = ({
  isOpen,
  onClose,
  targetStudent,
  defaultTeachingSkill = '',
  defaultLearningSkill = '',
  onRequestSent,
}) => {
  const currentStudent = storage.getCurrentStudent();

  const [teachingSkill, setTeachingSkill] = useState('');
  const [learningSkill, setLearningSkill] = useState('');
  const [preferredMode, setPreferredMode] = useState<'Online' | 'Offline' | 'Either'>('Online');
  const [message, setMessage] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (targetStudent && currentStudent) {
      const myTeachSkills = currentStudent.skills.filter(s => s.type === 'TEACH');
      const theirTeachSkills = targetStudent.skills.filter(s => s.type === 'TEACH');

      setTeachingSkill(defaultTeachingSkill || (myTeachSkills[0]?.skillName || ''));
      setLearningSkill(defaultLearningSkill || (theirTeachSkills[0]?.skillName || ''));
      setMessage(
        `Hi ${targetStudent.name}! I would love to exchange skills with you. Let's learn together!`
      );
      setError(null);
      setSuccess(false);
    }
  }, [targetStudent, defaultTeachingSkill, defaultLearningSkill, isOpen]);

  if (!isOpen || !targetStudent || !currentStudent) return null;

  const myTeachSkills = currentStudent.skills.filter(s => s.type === 'TEACH');
  const theirTeachSkills = targetStudent.skills.filter(s => s.type === 'TEACH');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!teachingSkill || !learningSkill) {
      setError('Please choose both a skill you can teach and a skill you want to learn.');
      return;
    }

    try {
      storage.sendExchangeRequest({
        receiverId: targetStudent.id,
        teachingSkill,
        learningSkill,
        message: message.trim() || 'Excited to exchange knowledge and schedule a learning session!',
        preferredMode,
      });

      setSuccess(true);
      setTimeout(() => {
        onRequestSent();
        onClose();
      }, 1400);
    } catch (err: any) {
      setError(err.message || 'Could not send request.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-[#E9DDFC]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-[#F8F7FC]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#7546D8] text-white flex items-center justify-center">
              <ArrowRightLeft className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#202033]">Propose Skill Exchange</h2>
              <p className="text-xs text-[#77758A]">Reciprocal peer knowledge exchange with {targetStudent.name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success ? (
            <div className="py-8 text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-green-100 text-[#16A36A] flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <p className="text-base font-bold text-[#202033]">Exchange Request Sent!</p>
              <p className="text-xs text-[#77758A]">
                {targetStudent.name} will be notified. Once accepted, you can schedule your session.
              </p>
            </div>
          ) : (
            <>
              {/* Partner Overview */}
              <div className="p-3.5 bg-[#FAF9FD] rounded-xl border border-[#E9DDFC] flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-sm"
                  style={{ backgroundColor: targetStudent.avatarBg || '#7546D8' }}
                >
                  {targetStudent.name.charAt(0)}
                </div>
                <div>
                  <p className="text-xs font-bold text-[#202033]">{targetStudent.name}</p>
                  <p className="text-[11px] text-[#77758A]">
                    {targetStudent.collegeName} · {targetStudent.branch} ({targetStudent.academicYear})
                  </p>
                </div>
              </div>

              {/* Skills Exchange Pair */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#202033] mb-1">
                    I Will Teach {targetStudent.name}:
                  </label>
                  <select
                    value={teachingSkill}
                    onChange={e => setTeachingSkill(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:border-[#7546D8] bg-white"
                  >
                    {myTeachSkills.length === 0 ? (
                      <option value="">No teaching skills configured yet</option>
                    ) : (
                      myTeachSkills.map(s => (
                        <option key={s.id} value={s.skillName}>
                          {s.skillName} ({s.proficiency})
                        </option>
                      ))
                    )}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#202033] mb-1">
                    I Want to Learn From {targetStudent.name}:
                  </label>
                  <select
                    value={learningSkill}
                    onChange={e => setLearningSkill(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:border-[#7546D8] bg-white"
                  >
                    {theirTeachSkills.length === 0 ? (
                      <option value="">No skills available to learn</option>
                    ) : (
                      theirTeachSkills.map(s => (
                        <option key={s.id} value={s.skillName}>
                          {s.skillName} ({s.proficiency})
                        </option>
                      ))
                    )}
                  </select>
                </div>
              </div>

              {/* Learning Format */}
              <div>
                <label className="block text-xs font-semibold text-[#202033] mb-1">Preferred Mode</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Online', 'Offline', 'Either'] as const).map(mode => (
                    <button
                      type="button"
                      key={mode}
                      onClick={() => setPreferredMode(mode)}
                      className={`py-2 text-xs font-semibold rounded-xl border transition-all cursor-pointer ${
                        preferredMode === mode
                          ? 'border-[#7546D8] bg-[#E9DDFC] text-[#5425A8]'
                          : 'border-gray-200 text-[#77758A] hover:bg-gray-50'
                      }`}
                    >
                      {mode === 'Online' ? '💻 Online (Meet)' : mode === 'Offline' ? '🏫 Campus / Lab' : '✨ Either'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="block text-xs font-semibold text-[#202033] mb-1">Personal Note</label>
                <textarea
                  rows={3}
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  placeholder="Introduce yourself and specify your learning goals..."
                  className="w-full p-3 text-xs border border-gray-200 rounded-xl focus:outline-none focus:border-[#7546D8]"
                />
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-semibold text-[#77758A] hover:bg-gray-100 rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={myTeachSkills.length === 0 || theirTeachSkills.length === 0}
                  className="px-5 py-2.5 bg-[#7546D8] hover:bg-[#5425A8] text-white text-xs font-bold rounded-xl shadow-md transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Exchange Proposal</span>
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
};
