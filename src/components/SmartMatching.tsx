import React, { useState } from 'react';
import {
  Sparkles,
  Repeat,
  CheckCircle2,
  ArrowRight,
  Filter,
  UserCheck,
  Star,
  BookOpen,
  Calendar,
  Search,
  School
} from 'lucide-react';
import { Student, MutualSkillMatch } from '../types';
import { storage } from '../services/storage';

interface SmartMatchingProps {
  currentStudent: Student | null;
  onConnect: (student: Student, defaultTeaching?: string, defaultLearning?: string) => void;
  onViewProfile: (student: Student) => void;
}

export const SmartMatching: React.FC<SmartMatchingProps> = ({
  currentStudent,
  onConnect,
  onViewProfile,
}) => {
  const [filterType, setFilterType] = useState<'ALL' | 'MUTUAL' | 'ONE_WAY'>('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  if (!currentStudent) {
    return (
      <div className="p-8 text-center bg-white rounded-2xl border border-gray-100">
        <p className="text-sm font-semibold text-[#202033]">Please log in as a student to see your skill matches.</p>
      </div>
    );
  }

  const allMatches = storage.getMatchesForStudent(currentStudent.id);

  const filteredMatches = allMatches.filter(m => {
    if (filterType === 'MUTUAL' && m.matchType !== 'MUTUAL') return false;
    if (filterType === 'ONE_WAY' && m.matchType === 'MUTUAL') return false;
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const matchName = m.student.name.toLowerCase().includes(q);
      const matchCollege = m.student.collegeName.toLowerCase().includes(q);
      const matchTeach = m.whatYouTeachThem.some(s => s.toLowerCase().includes(q));
      const matchLearn = m.whatTheyTeachYou.some(s => s.toLowerCase().includes(q));
      return matchName || matchCollege || matchTeach || matchLearn;
    }
    return true;
  });

  const mutualCount = allMatches.filter(m => m.matchType === 'MUTUAL').length;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-[#5425A8] to-[#7546D8] rounded-2xl p-6 text-white shadow-md relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 bg-white/5 rounded-full blur-2xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-[#E9DDFC] text-xs font-bold mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>PeerLearn Algorithmic Engine</span>
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight">Smart Skill Matching</h1>
            <p className="text-xs text-[#E9DDFC] mt-1 max-w-xl">
              Calculates reciprocal overlap between what you can teach and what fellow students want to learn. No guesswork—pure mutual value!
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-white/10 backdrop-blur-md px-4 py-3 rounded-xl border border-white/10 text-center">
              <p className="text-xl font-extrabold font-mono text-white">{mutualCount}</p>
              <p className="text-[10px] text-[#E9DDFC] uppercase tracking-wider font-semibold">
                Mutual Matches
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-md px-4 py-3 rounded-xl border border-white/10 text-center">
              <p className="text-xl font-extrabold font-mono text-white">{allMatches.length}</p>
              <p className="text-[10px] text-[#E9DDFC] uppercase tracking-wider font-semibold">
                Total Overlaps
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Segmented Filter */}
        <div className="flex items-center gap-1 p-1 bg-[#F8F7FC] rounded-xl w-full sm:w-auto">
          <button
            onClick={() => setFilterType('ALL')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              filterType === 'ALL' ? 'bg-[#7546D8] text-white shadow-xs' : 'text-[#77758A] hover:text-[#202033]'
            }`}
          >
            All Matches ({allMatches.length})
          </button>
          <button
            onClick={() => setFilterType('MUTUAL')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
              filterType === 'MUTUAL' ? 'bg-[#7546D8] text-white shadow-xs' : 'text-[#77758A] hover:text-[#202033]'
            }`}
          >
            <Sparkles className="w-3 h-3 text-amber-300" />
            <span>Mutual Only ({mutualCount})</span>
          </button>
          <button
            onClick={() => setFilterType('ONE_WAY')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              filterType === 'ONE_WAY' ? 'bg-[#7546D8] text-white shadow-xs' : 'text-[#77758A] hover:text-[#202033]'
            }`}
          >
            One-Way Matches
          </button>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Filter by skill or student..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs border border-gray-200 rounded-xl focus:outline-none focus:border-[#7546D8]"
          />
        </div>
      </div>

      {/* Matches Grid */}
      {filteredMatches.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 space-y-3">
          <div className="w-12 h-12 rounded-full bg-[#FAF9FD] text-[#7546D8] flex items-center justify-center mx-auto">
            <Repeat className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-[#202033]">No Matches Found</h3>
          <p className="text-xs text-[#77758A] max-w-md mx-auto">
            Try adding more skills you can teach or skills you want to learn in your profile to expand your automatic peer pairing network.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredMatches.map(match => {
            const isMutual = match.matchType === 'MUTUAL';
            return (
              <div
                key={match.student.id}
                className={`bg-white rounded-2xl p-5 border transition-all shadow-xs hover:shadow-md ${
                  isMutual
                    ? 'border-[#A78BFA] ring-2 ring-[#E9DDFC]/50'
                    : 'border-gray-100 hover:border-gray-200'
                }`}
              >
                {/* Header: Student Profile + Match Badge */}
                <div className="flex items-start justify-between gap-3 pb-3 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-11 h-11 rounded-xl flex items-center justify-center text-white font-extrabold text-sm shadow-xs"
                      style={{ backgroundColor: match.student.avatarBg || '#7546D8' }}
                    >
                      {match.student.name.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h3 className="text-sm font-bold text-[#202033]">{match.student.name}</h3>
                        <span className="text-[10px] text-[#77758A]">({match.student.academicYear})</span>
                      </div>
                      <p className="text-[11px] text-[#77758A] flex items-center gap-1">
                        <School className="w-3 h-3 text-[#7546D8]" />
                        <span className="truncate max-w-[180px]">{match.student.collegeName}</span>
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <div
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                        isMutual
                          ? 'bg-[#E9DDFC] text-[#5425A8]'
                          : 'bg-gray-100 text-[#77758A]'
                      }`}
                    >
                      {isMutual && <Sparkles className="w-3 h-3 text-[#7546D8]" />}
                      <span>{match.matchPercentage}% Match</span>
                    </div>
                    <p className="text-[10px] text-[#77758A] mt-0.5">
                      {isMutual ? 'Mutual Reciprocal' : 'Direct Skill Fit'}
                    </p>
                  </div>
                </div>

                {/* Exchange Breakdown Visual Bridge */}
                <div className="my-4 p-3 bg-[#FAF9FD] rounded-xl border border-gray-100 space-y-2">
                  {/* You Teach Them */}
                  {match.whatYouTeachThem.length > 0 && (
                    <div className="flex items-start gap-2 text-xs">
                      <span className="text-[11px] font-bold text-[#16A36A] uppercase shrink-0 w-28">
                        You Teach:
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {match.whatYouTeachThem.map(s => (
                          <span
                            key={s}
                            className="bg-green-50 text-[#16A36A] border border-green-200 text-[11px] px-2 py-0.5 rounded-md font-semibold"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* They Teach You */}
                  {match.whatTheyTeachYou.length > 0 && (
                    <div className="flex items-start gap-2 text-xs">
                      <span className="text-[11px] font-bold text-[#7546D8] uppercase shrink-0 w-28">
                        They Teach You:
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {match.whatTheyTeachYou.map(s => (
                          <span
                            key={s}
                            className="bg-[#E9DDFC]/60 text-[#5425A8] border border-[#E9DDFC] text-[11px] px-2 py-0.5 rounded-md font-semibold"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Rating & Availability */}
                <div className="flex items-center justify-between text-xs text-[#77758A] mb-4">
                  <div className="flex items-center gap-1 text-amber-500 font-semibold">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span>{match.student.rating.toFixed(1)}</span>
                    <span className="text-gray-400">({match.student.reviewCount})</span>
                  </div>
                  <div>
                    Status: <span className="font-semibold text-[#16A36A]">{match.student.availability}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
                  <button
                    onClick={() => onViewProfile(match.student)}
                    className="flex-1 py-2 text-xs font-semibold text-[#77758A] hover:text-[#202033] hover:bg-gray-100 rounded-xl transition-colors cursor-pointer text-center"
                  >
                    View Profile
                  </button>
                  <button
                    onClick={() =>
                      onConnect(
                        match.student,
                        match.whatYouTeachThem[0] || '',
                        match.whatTheyTeachYou[0] || ''
                      )
                    }
                    className="flex-1 py-2 bg-[#7546D8] hover:bg-[#5425A8] text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Repeat className="w-3.5 h-3.5" />
                    <span>Propose Exchange</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
