import React from 'react';
import { X, Star, Award, BookOpen, Calendar, MapPin, CheckCircle, ArrowRightLeft, School } from 'lucide-react';
import { Student } from '../types';

interface StudentProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: Student | null;
  onConnect: (student: Student) => void;
}

export const StudentProfileModal: React.FC<StudentProfileModalProps> = ({
  isOpen,
  onClose,
  student,
  onConnect,
}) => {
  if (!isOpen || !student) return null;

  const teachSkills = student.skills.filter(s => s.type === 'TEACH');
  const learnSkills = student.skills.filter(s => s.type === 'LEARN');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden border border-[#E9DDFC]">
        {/* Banner with Avatar */}
        <div className="bg-gradient-to-r from-[#5425A8] to-[#7546D8] p-6 text-white relative shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-start gap-4">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center font-extrabold text-2xl text-white shadow-lg border-2 border-white/20"
              style={{ backgroundColor: student.avatarBg || '#7546D8' }}
            >
              {student.name.charAt(0)}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold">{student.name}</h2>
                <span className="text-[11px] font-semibold bg-white/20 px-2 py-0.5 rounded-full">
                  {student.academicYear}
                </span>
              </div>
              <p className="text-xs text-[#E9DDFC] mt-0.5">{student.collegeName}</p>
              <p className="text-xs text-white/80">{student.branch}</p>

              <div className="flex flex-wrap items-center gap-4 mt-3 text-xs">
                <div className="flex items-center gap-1 text-amber-300 font-bold">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span>{student.rating.toFixed(1)}</span>
                  <span className="text-white/60 font-normal">({student.reviewCount} reviews)</span>
                </div>
                <div className="flex items-center gap-1 text-[#E9DDFC]">
                  <Award className="w-3.5 h-3.5" />
                  <span>{student.xpPoints} XP</span>
                </div>
                <div className="flex items-center gap-1 text-[#E9DDFC]">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{student.completedSessionsCount} Sessions Completed</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Bio */}
          <div>
            <h3 className="text-xs font-bold text-[#77758A] uppercase tracking-wider mb-2">About Student</h3>
            <p className="text-xs text-[#202033] leading-relaxed bg-[#F8F7FC] p-3 rounded-xl border border-gray-100">
              {student.bio || 'Student at PeerLearn ready to teach and learn technical & career skills.'}
            </p>
          </div>

          {/* Badges */}
          {student.badges && student.badges.length > 0 && (
            <div>
              <h3 className="text-xs font-bold text-[#77758A] uppercase tracking-wider mb-2">Achievements</h3>
              <div className="flex flex-wrap gap-2">
                {student.badges.map(b => (
                  <span
                    key={b}
                    className="px-2.5 py-1 bg-[#E9DDFC] text-[#5425A8] rounded-lg text-xs font-bold flex items-center gap-1"
                  >
                    <Award className="w-3.5 h-3.5 text-[#7546D8]" />
                    <span>{b}</span>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Skills Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Skills Can Teach */}
            <div className="border border-green-100 bg-green-50/30 p-4 rounded-xl">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-[#16A36A] uppercase tracking-wider">
                  Skills Can Teach ({teachSkills.length})
                </span>
              </div>
              <div className="space-y-2">
                {teachSkills.map(s => (
                  <div key={s.id} className="p-2.5 bg-white rounded-lg border border-gray-100 shadow-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#202033]">{s.skillName}</span>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded font-semibold ${
                          s.proficiency === 'Advanced'
                            ? 'bg-green-100 text-[#16A36A]'
                            : s.proficiency === 'Intermediate'
                            ? 'bg-purple-100 text-[#7546D8]'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {s.proficiency}
                      </span>
                    </div>
                    {s.yearsExperienceOrGoal && (
                      <p className="text-[11px] text-[#77758A] mt-1">{s.yearsExperienceOrGoal}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Skills Want to Learn */}
            <div className="border border-purple-100 bg-purple-50/30 p-4 rounded-xl">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-[#7546D8] uppercase tracking-wider">
                  Skills Wants to Learn ({learnSkills.length})
                </span>
              </div>
              <div className="space-y-2">
                {learnSkills.map(s => (
                  <div key={s.id} className="p-2.5 bg-white rounded-lg border border-gray-100 shadow-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#202033]">{s.skillName}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded font-semibold bg-amber-50 text-amber-700">
                        Target: {s.proficiency}
                      </span>
                    </div>
                    {s.yearsExperienceOrGoal && (
                      <p className="text-[11px] text-[#77758A] mt-1">{s.yearsExperienceOrGoal}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 bg-[#F8F7FC] flex items-center justify-between shrink-0">
          <div className="text-xs text-[#77758A]">
            Availability: <span className="font-semibold text-[#16A36A]">{student.availability}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-[#77758A] hover:bg-gray-200 rounded-xl transition-colors cursor-pointer"
            >
              Close
            </button>
            <button
              onClick={() => {
                onClose();
                onConnect(student);
              }}
              className="px-5 py-2.5 bg-[#7546D8] hover:bg-[#5425A8] text-white text-xs font-bold rounded-xl shadow-md transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowRightLeft className="w-3.5 h-3.5" />
              <span>Propose Exchange</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
