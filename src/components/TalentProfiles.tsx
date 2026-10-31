import React, { useState } from 'react';
import {
  Search,
  Filter,
  Star,
  Award,
  School,
  ArrowRightLeft,
  Calendar,
  Sparkles,
  Users
} from 'lucide-react';
import { Student } from '../types';
import { storage } from '../services/storage';

interface TalentProfilesProps {
  currentStudent: Student | null;
  onConnect: (student: Student) => void;
  onViewProfile: (student: Student) => void;
}

export const TalentProfiles: React.FC<TalentProfilesProps> = ({
  currentStudent,
  onConnect,
  onViewProfile,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedYear, setSelectedYear] = useState('ALL');
  const [selectedAvailability, setSelectedAvailability] = useState('ALL');
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  const students = storage.getStudents();
  // Filter out current user from browse list
  const otherStudents = currentStudent
    ? students.filter(s => s.id !== currentStudent.id)
    : students;

  const filteredStudents = otherStudents.filter(s => {
    if (selectedYear !== 'ALL' && s.academicYear !== selectedYear) return false;
    if (selectedAvailability !== 'ALL' && s.availability !== selectedAvailability) return false;
    if (selectedCategory !== 'ALL') {
      const hasCategory = s.skills.some(sk => sk.category === selectedCategory);
      if (!hasCategory) return false;
    }
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const matchName = s.name.toLowerCase().includes(q);
      const matchCollege = s.collegeName.toLowerCase().includes(q);
      const matchBranch = s.branch.toLowerCase().includes(q);
      const matchSkill = s.skills.some(sk => sk.skillName.toLowerCase().includes(q));
      return matchName || matchCollege || matchBranch || matchSkill;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Users className="w-5 h-5 text-[#7546D8]" />
            <h1 className="text-xl font-extrabold text-[#202033]">Talent Profiles</h1>
          </div>
          <p className="text-xs text-[#77758A]">
            Discover peers from Vasavi, CBIT, Osmania, BITS Pilani, and more to exchange technical and career skills.
          </p>
        </div>

        <div className="text-xs font-semibold text-[#5425A8] bg-[#E9DDFC] px-3 py-1.5 rounded-xl self-start md:self-auto font-mono">
          {filteredStudents.length} Students Available
        </div>
      </div>

      {/* Search and Multi-Filter Controls */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search by student name, college, or skill (e.g. Java, Python, AWS, Figma)..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:border-[#7546D8]"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Academic Year Filter */}
            <select
              value={selectedYear}
              onChange={e => setSelectedYear(e.target.value)}
              className="px-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:border-[#7546D8] bg-white text-[#202033]"
            >
              <option value="ALL">All Years</option>
              <option value="1st Year">1st Year</option>
              <option value="2nd Year">2nd Year</option>
              <option value="3rd Year">3rd Year</option>
              <option value="4th Year">4th Year</option>
            </select>

            {/* Availability Filter */}
            <select
              value={selectedAvailability}
              onChange={e => setSelectedAvailability(e.target.value)}
              className="px-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:border-[#7546D8] bg-white text-[#202033]"
            >
              <option value="ALL">All Availability</option>
              <option value="Available">Available Now</option>
              <option value="Weekends Only">Weekends Only</option>
              <option value="Busy">Busy</option>
            </select>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              className="px-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:border-[#7546D8] bg-white text-[#202033]"
            >
              <option value="ALL">All Categories</option>
              <option value="Programming">Programming</option>
              <option value="Web Development">Web Development</option>
              <option value="Data and AI">Data and AI</option>
              <option value="Career Skills">Career Skills</option>
              <option value="Communication">Communication</option>
              <option value="Creative">Creative</option>
              <option value="Cloud and DevOps">Cloud and DevOps</option>
            </select>
          </div>
        </div>
      </div>

      {/* Student Cards Grid */}
      {filteredStudents.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-gray-100">
          <p className="text-sm font-bold text-[#202033]">No student profiles match your filter criteria.</p>
          <p className="text-xs text-[#77758A] mt-1">Try clearing your filters or search keywords.</p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedYear('ALL');
              setSelectedAvailability('ALL');
              setSelectedCategory('ALL');
            }}
            className="mt-4 px-4 py-2 bg-[#FAF9FD] text-[#7546D8] border border-[#E9DDFC] rounded-xl text-xs font-bold hover:bg-[#E9DDFC] transition-colors cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredStudents.map(student => {
            const teachSkills = student.skills.filter(s => s.type === 'TEACH');
            const learnSkills = student.skills.filter(s => s.type === 'LEARN');

            return (
              <div
                key={student.id}
                className="bg-white rounded-3xl p-5 border border-gray-100 shadow-xs hover:shadow-lg hover:border-[#E9DDFC] transition-all flex flex-col justify-between group"
              >
                <div>
                  {/* Top Bar: Avatar, Name, College */}
                  <div className="flex items-start justify-between gap-3 pb-3 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-12 h-12 rounded-2xl flex items-center justify-center font-extrabold text-base text-white shadow-xs group-hover:scale-105 transition-transform"
                        style={{ backgroundColor: student.avatarBg || '#7546D8' }}
                      >
                        {student.name.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h3 className="text-sm font-bold text-[#202033] group-hover:text-[#7546D8] transition-colors">
                            {student.name}
                          </h3>
                        </div>
                        <p className="text-[11px] text-[#77758A] truncate max-w-[170px]">{student.collegeName}</p>
                        <p className="text-[10px] text-[#5425A8] font-medium">{student.branch} · {student.academicYear}</p>
                      </div>
                    </div>

                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                        student.availability === 'Available'
                          ? 'bg-green-100 text-[#16A36A]'
                          : student.availability === 'Weekends Only'
                          ? 'bg-amber-100 text-[#F5A623]'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {student.availability}
                    </span>
                  </div>

                  {/* Rating & Sessions Stats */}
                  <div className="flex items-center justify-between text-xs text-[#77758A] py-2.5">
                    <div className="flex items-center gap-1 text-amber-500 font-bold">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <span>{student.rating.toFixed(1)}</span>
                      <span className="text-gray-400 font-normal">({student.reviewCount})</span>
                    </div>
                    <div className="flex items-center gap-1 text-[#5425A8] font-semibold">
                      <Award className="w-3.5 h-3.5" />
                      <span>{student.xpPoints} XP</span>
                    </div>
                  </div>

                  {/* Skills Section */}
                  <div className="space-y-2.5 py-1 text-xs">
                    <div>
                      <span className="text-[10px] font-bold text-[#16A36A] uppercase tracking-wider block mb-1">
                        Can Teach:
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {teachSkills.slice(0, 3).map(s => (
                          <span
                            key={s.id}
                            className="bg-green-50 text-[#16A36A] border border-green-200 text-[10px] px-2 py-0.5 rounded-md font-semibold"
                          >
                            {s.skillName} ({s.proficiency})
                          </span>
                        ))}
                        {teachSkills.length > 3 && (
                          <span className="text-[10px] text-gray-400 self-center">
                            +{teachSkills.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>

                    <div>
                      <span className="text-[10px] font-bold text-[#7546D8] uppercase tracking-wider block mb-1">
                        Wants to Learn:
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {learnSkills.slice(0, 3).map(s => (
                          <span
                            key={s.id}
                            className="bg-[#E9DDFC]/50 text-[#5425A8] border border-[#E9DDFC] text-[10px] px-2 py-0.5 rounded-md font-semibold"
                          >
                            {s.skillName}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="flex items-center gap-2 pt-4 mt-4 border-t border-gray-100">
                  <button
                    onClick={() => onViewProfile(student)}
                    className="flex-1 py-2 text-xs font-semibold text-[#77758A] hover:bg-gray-100 hover:text-[#202033] rounded-xl transition-colors cursor-pointer text-center"
                  >
                    View Profile
                  </button>
                  <button
                    onClick={() => onConnect(student)}
                    className="flex-1 py-2 bg-[#7546D8] hover:bg-[#5425A8] text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <ArrowRightLeft className="w-3.5 h-3.5" />
                    <span>Connect</span>
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
