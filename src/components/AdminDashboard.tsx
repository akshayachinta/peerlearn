import React, { useState } from 'react';
import {
  ShieldAlert,
  Users,
  Award,
  Sparkles,
  ArrowRightLeft,
  Calendar,
  CheckCircle2,
  XCircle,
  BarChart3,
  Megaphone,
  Trash2,
  Plus,
  Search,
  Filter,
  LogOut,
  Settings,
  AlertTriangle,
  RotateCcw
} from 'lucide-react';
import { storage } from '../services/storage';
import { Student, SkillCategoryName, SkillItem } from '../types';

interface AdminDashboardProps {
  onBackToStudentPortal: () => void;
  onAdminLogout: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onBackToStudentPortal,
  onAdminLogout,
}) => {
  const [activeModule, setActiveModule] = useState<
    'OVERVIEW' | 'STUDENTS' | 'SKILLS' | 'REQUESTS' | 'SESSIONS' | 'ANALYTICS' | 'ANNOUNCEMENTS' | 'REVIEWS' | 'SETTINGS'
  >('OVERVIEW');

  // Student search & filter
  const [studentSearch, setStudentSearch] = useState('');
  const [branchFilter, setBranchFilter] = useState('ALL');

  // Add Skill Form
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillCategory, setNewSkillCategory] = useState<SkillCategoryName>('Programming');
  const [skillError, setSkillError] = useState<string | null>(null);

  // Announcement Form
  const [annTitle, setAnnTitle] = useState('');
  const [annContent, setAnnContent] = useState('');
  const [annPriority, setAnnPriority] = useState<'NORMAL' | 'HIGH' | 'URGENT'>('NORMAL');

  // Force re-render helper
  const [, setTick] = useState(0);
  const refresh = () => setTick(t => t + 1);

  const stats = storage.getAdminStats();
  const students = storage.getStudents(true);
  const allSkills = storage.getAllSkills();
  const allRequests = storage.getRequests();
  const allSessions = storage.getSessions();
  const announcements = storage.getAnnouncements();
  const reviews = storage.getReviews();

  // Handle student status toggle
  const handleToggleStatus = (id: string) => {
    storage.toggleStudentStatus(id);
    refresh();
  };

  // Handle student deletion
  const handleDeleteStudent = (id: string) => {
    if (confirm('Are you sure you want to delete this student account? This cannot be undone.')) {
      storage.deleteStudent(id);
      refresh();
    }
  };

  // Handle Add Catalog Skill
  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    setSkillError(null);
    if (!newSkillName.trim()) {
      setSkillError('Skill name cannot be empty.');
      return;
    }
    try {
      storage.addCatalogSkill(newSkillName.trim(), newSkillCategory);
      setNewSkillName('');
      refresh();
    } catch (err: any) {
      setSkillError(err.message || 'Error adding skill.');
    }
  };

  const handleDeleteCatalogSkill = (id: string) => {
    storage.deleteCatalogSkill(id);
    refresh();
  };

  // Handle Add Announcement
  const handleAddAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!annTitle.trim() || !annContent.trim()) return;
    storage.addAnnouncement(annTitle.trim(), annContent.trim(), annPriority);
    setAnnTitle('');
    setAnnContent('');
    refresh();
  };

  const handleDeleteAnnouncement = (id: string) => {
    storage.deleteAnnouncement(id);
    refresh();
  };

  const handleResetData = () => {
    if (confirm('Reset entire platform database to initial state? (Cleans demo state for testing)')) {
      storage.resetToDefaults();
      refresh();
    }
  };

  const filteredStudents = students.filter(s => {
    if (branchFilter !== 'ALL' && !s.branch.toLowerCase().includes(branchFilter.toLowerCase())) return false;
    if (studentSearch.trim()) {
      const q = studentSearch.toLowerCase();
      return (
        s.name.toLowerCase().includes(q) ||
        s.email.toLowerCase().includes(q) ||
        s.collegeName.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-[#F8F7FC] flex flex-col text-[#202033]">
      {/* Admin Top Header */}
      <header className="bg-[#202033] text-white border-b border-gray-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#5425A8] flex items-center justify-center shadow">
              <ShieldAlert className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm sm:text-base tracking-tight">
                  PeerLearn Admin Console
                </span>
                <span className="text-[10px] bg-red-600 font-bold px-2 py-0.5 rounded uppercase">
                  Protected
                </span>
              </div>
              <p className="text-[10px] text-gray-400">Institutional Governance &amp; DevOps System</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleResetData}
              className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
              title="Reset initial seed data"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset Test Data</span>
            </button>
            <button
              onClick={onBackToStudentPortal}
              className="px-3 py-1.5 bg-[#5425A8] hover:bg-[#7546D8] text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              Back to Student Portal
            </button>
            <button
              onClick={onAdminLogout}
              className="p-2 text-gray-400 hover:text-white rounded-lg transition-colors cursor-pointer"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Admin Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-6">
        {/* Module Switcher Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 bg-white p-2 rounded-2xl border border-gray-100 shadow-xs">
          {[
            { id: 'OVERVIEW', label: 'Overview KPIs', icon: BarChart3 },
            { id: 'STUDENTS', label: `Students (${students.length})`, icon: Users },
            { id: 'SKILLS', label: `Skill Catalog (${allSkills.length})`, icon: Award },
            { id: 'REQUESTS', label: `Requests (${allRequests.length})`, icon: ArrowRightLeft },
            { id: 'SESSIONS', label: `Sessions (${allSessions.length})`, icon: Calendar },
            { id: 'ANALYTICS', label: 'Analytics & Trends', icon: Sparkles },
            { id: 'ANNOUNCEMENTS', label: `Announcements (${announcements.length})`, icon: Megaphone },
            { id: 'REVIEWS', label: `Feedback & Moderation`, icon: AlertTriangle },
          ].map(mod => {
            const Icon = mod.icon;
            const isActive = activeModule === mod.id;
            return (
              <button
                key={mod.id}
                onClick={() => setActiveModule(mod.id as any)}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                  isActive
                    ? 'bg-[#5425A8] text-white shadow-sm'
                    : 'text-[#77758A] hover:bg-gray-100 hover:text-[#202033]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{mod.label}</span>
              </button>
            );
          })}
        </div>

        {/* OVERVIEW MODULE */}
        {activeModule === 'OVERVIEW' && (
          <div className="space-y-6">
            {/* 6 Key Overview Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs">
                <span className="text-xs font-bold text-[#77758A] uppercase tracking-wider block mb-1">
                  Total Registered Students
                </span>
                <p className="text-3xl font-extrabold text-[#202033] font-mono tabular-nums">
                  {stats.totalStudents}
                </p>
                <p className="text-xs text-[#16A36A] font-semibold mt-1">
                  {stats.activeStudents} active student accounts
                </p>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs">
                <span className="text-xs font-bold text-[#77758A] uppercase tracking-wider block mb-1">
                  Mutual Skill Matches
                </span>
                <p className="text-3xl font-extrabold text-[#5425A8] font-mono tabular-nums">
                  {stats.totalMutualMatches}
                </p>
                <p className="text-xs text-[#77758A] mt-1">Algorithmic reciprocal pairs</p>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs">
                <span className="text-xs font-bold text-[#77758A] uppercase tracking-wider block mb-1">
                  Cataloged Skills
                </span>
                <p className="text-3xl font-extrabold text-[#7546D8] font-mono tabular-nums">
                  {stats.totalSkills}
                </p>
                <p className="text-xs text-[#77758A] mt-1">Spanning 7 primary categories</p>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs">
                <span className="text-xs font-bold text-[#77758A] uppercase tracking-wider block mb-1">
                  Exchange Proposals
                </span>
                <p className="text-3xl font-extrabold text-[#202033] font-mono tabular-nums">
                  {stats.totalRequests}
                </p>
                <p className="text-xs text-[#77758A] mt-1">Peer exchange inquiries sent</p>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs">
                <span className="text-xs font-bold text-[#77758A] uppercase tracking-wider block mb-1">
                  Completed Learning Sessions
                </span>
                <p className="text-3xl font-extrabold text-[#16A36A] font-mono tabular-nums">
                  {stats.completedSessions}
                </p>
                <p className="text-xs text-[#16A36A] font-semibold mt-1">Verified mentorship completed</p>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs">
                <span className="text-xs font-bold text-[#77758A] uppercase tracking-wider block mb-1">
                  Scheduled Upcoming Sessions
                </span>
                <p className="text-3xl font-extrabold text-[#F5A623] font-mono tabular-nums">
                  {stats.upcomingSessions}
                </p>
                <p className="text-xs text-[#77758A] mt-1">Active on campus calendar</p>
              </div>
            </div>

            {/* Recent Exchange Velocity */}
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs">
              <h3 className="text-sm font-bold text-[#202033] mb-4">Latest Exchange Requests Across Campuses</h3>
              <div className="space-y-3">
                {allRequests.slice(0, 5).map(req => (
                  <div key={req.id} className="p-3 bg-[#F8F7FC] rounded-2xl flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-[#202033]">{req.senderName}</span> ({req.senderCollege})
                      <span className="text-gray-400 mx-2">→</span>
                      <span className="font-bold text-[#202033]">{req.receiverName}</span> ({req.receiverCollege})
                      <div className="text-[11px] text-[#77758A] mt-0.5">
                        Exchange: <span className="text-[#16A36A] font-semibold">{req.teachingSkill}</span> ⇄ <span className="text-[#7546D8] font-semibold">{req.learningSkill}</span>
                      </div>
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                        req.status === 'ACCEPTED' ? 'bg-green-100 text-[#16A36A]' : req.status === 'PENDING' ? 'bg-amber-100 text-[#F5A623]' : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {req.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STUDENTS MANAGEMENT MODULE */}
        {activeModule === 'STUDENTS' && (
          <div className="bg-white rounded-3xl border border-gray-100 shadow-xs overflow-hidden">
            <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3 flex-1 max-w-md">
                <div className="relative w-full">
                  <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    placeholder="Search by student name, email, or college..."
                    value={studentSearch}
                    onChange={e => setStudentSearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:border-[#5425A8]"
                  />
                </div>
              </div>

              <select
                value={branchFilter}
                onChange={e => setBranchFilter(e.target.value)}
                className="px-3 py-2 text-xs border border-gray-200 rounded-xl bg-white text-[#202033]"
              >
                <option value="ALL">All Branches</option>
                <option value="Computer">Computer Science</option>
                <option value="Information">Information Technology</option>
                <option value="Artificial">AI &amp; Data Science</option>
                <option value="Electronics">ECE</option>
                <option value="Mechanical">Mechanical</option>
              </select>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F8F7FC] text-[#77758A] uppercase font-bold text-[10px] tracking-wider border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-3.5">Student</th>
                    <th className="px-6 py-3.5">College &amp; Branch</th>
                    <th className="px-6 py-3.5">Year</th>
                    <th className="px-6 py-3.5">Rating &amp; XP</th>
                    <th className="px-6 py-3.5">Status</th>
                    <th className="px-6 py-3.5 text-right">Administrative Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredStudents.map(student => (
                    <tr key={student.id} className="hover:bg-[#FAF9FD] transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs text-white"
                            style={{ backgroundColor: student.avatarBg || '#7546D8' }}
                          >
                            {student.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-bold text-[#202033]">{student.name}</p>
                            <p className="text-[10px] text-[#77758A]">{student.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-medium text-[#202033]">{student.collegeName}</p>
                        <p className="text-[10px] text-[#77758A]">{student.branch}</p>
                      </td>
                      <td className="px-6 py-4 font-mono font-medium">{student.academicYear}</td>
                      <td className="px-6 py-4 font-mono">
                        <span className="text-amber-500 font-bold">★ {student.rating.toFixed(1)}</span>
                        <span className="text-[#5425A8] ml-2 font-bold">{student.xpPoints} XP</span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                            student.status === 'ACTIVE'
                              ? 'bg-green-100 text-[#16A36A]'
                              : 'bg-red-100 text-red-600'
                          }`}
                        >
                          {student.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleToggleStatus(student.id)}
                            className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-colors cursor-pointer ${
                              student.status === 'ACTIVE'
                                ? 'bg-amber-50 text-amber-800 hover:bg-amber-100'
                                : 'bg-green-50 text-green-800 hover:bg-green-100'
                            }`}
                          >
                            {student.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
                          </button>
                          <button
                            onClick={() => handleDeleteStudent(student.id)}
                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                            title="Delete Account"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* SKILLS MANAGEMENT MODULE */}
        {activeModule === 'SKILLS' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Add Skill to Catalog Form */}
            <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-gray-100 shadow-xs h-fit space-y-4">
              <h3 className="text-sm font-bold text-[#202033] flex items-center gap-2">
                <Plus className="w-4 h-4 text-[#5425A8]" />
                <span>Add New Skill to Catalog</span>
              </h3>

              {skillError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700">
                  {skillError}
                </div>
              )}

              <form onSubmit={handleAddSkill} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-[#202033] mb-1">Category</label>
                  <select
                    value={newSkillCategory}
                    onChange={e => setNewSkillCategory(e.target.value as SkillCategoryName)}
                    className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:border-[#5425A8] bg-white"
                  >
                    <option value="Programming">Programming</option>
                    <option value="Web Development">Web Development</option>
                    <option value="Data and AI">Data and AI</option>
                    <option value="Career Skills">Career Skills</option>
                    <option value="Communication">Communication</option>
                    <option value="Creative">Creative</option>
                    <option value="Cloud and DevOps">Cloud and DevOps</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#202033] mb-1">Skill Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Next.js, Rust, Snowflake, Terraform"
                    value={newSkillName}
                    onChange={e => setNewSkillName(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:border-[#5425A8]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-[#5425A8] hover:bg-[#202033] text-white text-xs font-bold rounded-xl shadow transition-colors cursor-pointer"
                >
                  Publish Skill to Catalog
                </button>
              </form>
            </div>

            {/* Current Catalog Grid */}
            <div className="lg:col-span-8 bg-white p-6 rounded-3xl border border-gray-100 shadow-xs">
              <h3 className="text-sm font-bold text-[#202033] mb-4">
                Active Catalog Skills ({allSkills.length})
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {allSkills.map(sk => (
                  <div
                    key={sk.id}
                    className="p-3 bg-[#F8F7FC] rounded-2xl border border-gray-100 flex items-center justify-between text-xs"
                  >
                    <div>
                      <p className="font-bold text-[#202033]">{sk.name}</p>
                      <p className="text-[10px] text-[#77758A]">{sk.category}</p>
                    </div>
                    <button
                      onClick={() => handleDeleteCatalogSkill(sk.id)}
                      className="text-gray-400 hover:text-red-600 p-1 cursor-pointer"
                      title="Remove from catalog"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* REQUESTS MODULE */}
        {activeModule === 'REQUESTS' && (
          <div className="bg-white rounded-3xl border border-gray-100 shadow-xs overflow-hidden">
            <div className="p-5 border-b border-gray-100">
              <h3 className="text-sm font-bold text-[#202033]">Campus Exchange Audit Logs ({allRequests.length})</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F8F7FC] text-[#77758A] uppercase font-bold text-[10px] tracking-wider border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-3.5">Sender</th>
                    <th className="px-6 py-3.5">Receiver</th>
                    <th className="px-6 py-3.5">Offered Skill</th>
                    <th className="px-6 py-3.5">Requested Skill</th>
                    <th className="px-6 py-3.5">Preferred Mode</th>
                    <th className="px-6 py-3.5">Status</th>
                    <th className="px-6 py-3.5">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {allRequests.map(r => (
                    <tr key={r.id} className="hover:bg-[#FAF9FD]">
                      <td className="px-6 py-3.5 font-bold text-[#202033]">{r.senderName}</td>
                      <td className="px-6 py-3.5 font-bold text-[#202033]">{r.receiverName}</td>
                      <td className="px-6 py-3.5 text-[#16A36A] font-semibold">{r.teachingSkill}</td>
                      <td className="px-6 py-3.5 text-[#7546D8] font-semibold">{r.learningSkill}</td>
                      <td className="px-6 py-3.5">{r.preferredMode}</td>
                      <td className="px-6 py-3.5">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                            r.status === 'ACCEPTED'
                              ? 'bg-green-100 text-[#16A36A]'
                              : r.status === 'PENDING'
                              ? 'bg-amber-100 text-[#F5A623]'
                              : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {r.status}
                        </span>
                      </td>
                      <td className="px-6 py-3.5 text-gray-400 font-mono text-[11px]">
                        {new Date(r.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* SESSIONS MODULE */}
        {activeModule === 'SESSIONS' && (
          <div className="bg-white rounded-3xl border border-gray-100 shadow-xs overflow-hidden">
            <div className="p-5 border-b border-gray-100">
              <h3 className="text-sm font-bold text-[#202033]">Campus Learning Sessions ({allSessions.length})</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F8F7FC] text-[#77758A] uppercase font-bold text-[10px] tracking-wider border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-3.5">Mentor</th>
                    <th className="px-6 py-3.5">Learner</th>
                    <th className="px-6 py-3.5">Topic</th>
                    <th className="px-6 py-3.5">Date &amp; Time</th>
                    <th className="px-6 py-3.5">Mode</th>
                    <th className="px-6 py-3.5">Status</th>
                    <th className="px-6 py-3.5">Rating</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {allSessions.map(s => (
                    <tr key={s.id} className="hover:bg-[#FAF9FD]">
                      <td className="px-6 py-3.5 font-bold text-[#202033]">{s.mentorName}</td>
                      <td className="px-6 py-3.5 font-bold text-[#202033]">{s.learnerName}</td>
                      <td className="px-6 py-3.5 font-semibold text-[#5425A8]">{s.skillName}</td>
                      <td className="px-6 py-3.5 font-mono text-[11px] text-[#77758A]">{s.date} {s.time}</td>
                      <td className="px-6 py-3.5">{s.mode}</td>
                      <td className="px-6 py-3.5">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                            s.status === 'COMPLETED'
                              ? 'bg-green-100 text-[#16A36A]'
                              : s.status === 'UPCOMING'
                              ? 'bg-amber-100 text-[#F5A623]'
                              : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {s.status}
                        </span>
                      </td>
                      <td className="px-6 py-3.5 font-mono text-amber-500 font-bold">
                        {s.mentorRating ? `★ ${s.mentorRating}` : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ANALYTICS & REPORTS MODULE */}
        {activeModule === 'ANALYTICS' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs">
              <h3 className="text-sm font-bold text-[#202033] mb-2">Most Offered Skills (Student Teachers)</h3>
              <p className="text-xs text-[#77758A] mb-4">Frequency of skills listed as TEACH across all students</p>

              <div className="space-y-3">
                {[
                  { skill: 'Python', count: 4, pct: 80 },
                  { skill: 'Java', count: 3, pct: 60 },
                  { skill: 'Machine Learning', count: 3, pct: 60 },
                  { skill: 'AWS & Cloud', count: 2, pct: 40 },
                  { skill: 'UI/UX Design', count: 2, pct: 40 },
                  { skill: 'Resume Building & Interview', count: 2, pct: 40 },
                ].map(item => (
                  <div key={item.skill} className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="font-semibold text-[#202033]">{item.skill}</span>
                      <span className="font-mono text-[#77758A]">{item.count} mentors ({item.pct}%)</span>
                    </div>
                    <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-[#7546D8] h-full rounded-full" style={{ width: `${item.pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs">
              <h3 className="text-sm font-bold text-[#202033] mb-2">Most Demanded Skills (Learners)</h3>
              <p className="text-xs text-[#77758A] mb-4">Frequency of skills listed as LEARN by students</p>

              <div className="space-y-3">
                {[
                  { skill: 'Java & Spring Boot', count: 4, pct: 80 },
                  { skill: 'Docker & DevOps', count: 3, pct: 60 },
                  { skill: 'Machine Learning & AI', count: 3, pct: 60 },
                  { skill: 'Python for Scripting', count: 2, pct: 40 },
                  { skill: 'Public Speaking', count: 2, pct: 40 },
                  { skill: 'UI/UX Wireframing', count: 2, pct: 40 },
                ].map(item => (
                  <div key={item.skill} className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="font-semibold text-[#202033]">{item.skill}</span>
                      <span className="font-mono text-[#77758A]">{item.count} seekers ({item.pct}%)</span>
                    </div>
                    <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-[#16A36A] h-full rounded-full" style={{ width: `${item.pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* CAMPUS ANNOUNCEMENTS MODULE */}
        {activeModule === 'ANNOUNCEMENTS' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-gray-100 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-[#202033] flex items-center gap-2">
                <Megaphone className="w-4 h-4 text-[#5425A8]" />
                <span>Broadcast New Announcement</span>
              </h3>
              <form onSubmit={handleAddAnnouncement} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-[#202033] mb-1">Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. End-Semester Peer Mentorship Hackathon"
                    value={annTitle}
                    onChange={e => setAnnTitle(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:border-[#5425A8]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#202033] mb-1">Announcement Content</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Provide details about dates, bonus XP, or campus guidelines..."
                    value={annContent}
                    onChange={e => setAnnContent(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:border-[#5425A8]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#202033] mb-1">Priority</label>
                  <select
                    value={annPriority}
                    onChange={e => setAnnPriority(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl bg-white text-[#202033]"
                  >
                    <option value="NORMAL">Normal Priority</option>
                    <option value="HIGH">High Priority</option>
                    <option value="URGENT">Urgent Alert</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-[#5425A8] hover:bg-[#202033] text-white text-xs font-bold rounded-xl shadow transition-colors cursor-pointer"
                >
                  Broadcast to Student Dashboards
                </button>
              </form>
            </div>

            <div className="lg:col-span-7 space-y-4">
              {announcements.map(ann => (
                <div key={ann.id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-[#202033]">{ann.title}</h4>
                      <span className="text-[10px] font-bold bg-[#E9DDFC] text-[#5425A8] px-2 py-0.5 rounded">
                        {ann.priority}
                      </span>
                    </div>
                    <p className="text-xs text-[#77758A] leading-relaxed">{ann.content}</p>
                    <p className="text-[10px] text-gray-400 font-mono">Posted on {new Date(ann.createdAt).toLocaleDateString()}</p>
                  </div>
                  <button
                    onClick={() => handleDeleteAnnouncement(ann.id)}
                    className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg cursor-pointer"
                    title="Delete Announcement"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* REVIEWS & SAFETY MODULE */}
        {activeModule === 'REVIEWS' && (
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-[#202033]">Peer Reviews &amp; Moderation</h3>
            <div className="space-y-3">
              {reviews.map(rev => (
                <div key={rev.id} className="p-4 bg-[#F8F7FC] rounded-2xl border border-gray-100 flex items-start justify-between gap-4 text-xs">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-[#202033]">{rev.fromStudentName}</span>
                      <span className="text-gray-400">reviewed</span>
                      <span className="font-bold text-[#5425A8]">{rev.toStudentName}</span>
                      <span className="text-amber-500 font-bold ml-2">★ {rev.rating}/5</span>
                    </div>
                    <p className="text-[#77758A] italic">"{rev.comment}"</p>
                    <span className="text-[10px] text-gray-400 font-mono">{rev.date}</span>
                  </div>
                  <button
                    onClick={() => {
                      storage.deleteReview(rev.id);
                      refresh();
                    }}
                    className="text-red-500 hover:text-red-700 text-[11px] font-bold cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
