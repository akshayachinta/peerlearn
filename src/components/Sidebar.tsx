import React from 'react';
import {
  LayoutDashboard,
  Sparkles,
  Users,
  Award,
  Grid,
  ArrowRightLeft,
  CalendarDays,
  Activity,
  CheckCircle,
  Clock,
  ShieldAlert
} from 'lucide-react';
import { Student } from '../types';
import { storage } from '../services/storage';

interface SidebarProps {
  currentTab: string;
  onNavigate: (tab: string) => void;
  currentStudent: Student | null;
  isAdmin: boolean;
  onStudentUpdated: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onNavigate,
  currentStudent,
  isAdmin,
  onStudentUpdated,
}) => {
  const pendingCount = currentStudent
    ? storage.getRequestsForStudent(currentStudent.id).incoming.length
    : 0;

  const mutualMatches = currentStudent
    ? storage.getMatchesForStudent(currentStudent.id).filter(m => m.matchType === 'MUTUAL').length
    : 0;

  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'matches',
      label: 'Smart Matching',
      icon: Sparkles,
      badge: mutualMatches > 0 ? `${mutualMatches} Mutual` : null,
      badgeBg: 'bg-[#E9DDFC] text-[#5425A8]',
    },
    {
      id: 'profiles',
      label: 'Talent Profiles',
      icon: Users,
      badge: null,
    },
    {
      id: 'my-skills',
      label: 'My Skills',
      icon: Award,
      badge: currentStudent ? `${currentStudent.skills.length}` : null,
      badgeBg: 'bg-gray-100 text-[#77758A]',
    },
    {
      id: 'categories',
      label: 'Skill Categories',
      icon: Grid,
      badge: null,
    },
    {
      id: 'requests',
      label: 'Exchange Requests',
      icon: ArrowRightLeft,
      badge: pendingCount > 0 ? `${pendingCount}` : null,
      badgeBg: 'bg-[#7546D8] text-white',
    },
    {
      id: 'sessions',
      label: 'Learning Sessions',
      icon: CalendarDays,
      badge: null,
    },
    {
      id: 'activity',
      label: 'Campus Activity',
      icon: Activity,
      badge: null,
    },
  ];

  const handleToggleAvailability = () => {
    if (!currentStudent) return;
    const nextStatus = currentStudent.availability === 'Available' ? 'Busy' : 'Available';
    storage.updateStudent(currentStudent.id, { availability: nextStatus });
    onStudentUpdated();
  };

  return (
    <aside className="w-64 bg-white border-r border-gray-100 flex flex-col shrink-0 min-h-[calc(100vh-4rem)]">
      {/* Navigation Links */}
      <div className="p-4 flex-1 space-y-1.5 overflow-y-auto">
        <div className="px-3 py-1.5 text-[10px] font-bold tracking-wider text-[#77758A] uppercase">
          Student Portal
        </div>

        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#7546D8] text-white shadow-sm shadow-[#7546D8]/20'
                  : 'text-[#77758A] hover:text-[#202033] hover:bg-[#F8F7FC]'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[#7546D8]'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                    isActive ? 'bg-white/20 text-white' : item.badgeBg || 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Student Status & Level Box */}
      {currentStudent && (
        <div className="p-4 border-t border-gray-100 bg-[#FAF9FD]">
          <div className="bg-white p-3 rounded-xl border border-[#E9DDFC] shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-[#202033]">Status</span>
              <button
                onClick={handleToggleAvailability}
                className="flex items-center gap-1.5 text-[11px] font-semibold text-[#7546D8] hover:underline cursor-pointer"
              >
                {currentStudent.availability === 'Available' ? (
                  <>
                    <span className="w-2 h-2 rounded-full bg-[#16A36A]" />
                    <span>Available</span>
                  </>
                ) : (
                  <>
                    <span className="w-2 h-2 rounded-full bg-[#F5A623]" />
                    <span>Busy</span>
                  </>
                )}
              </button>
            </div>

            <div className="flex items-center justify-between text-[11px] pt-2 border-t border-gray-50 text-[#77758A]">
              <span>Peer XP</span>
              <span className="font-bold text-[#5425A8] font-mono">{currentStudent.xpPoints} XP</span>
            </div>
            <div className="w-full bg-gray-100 h-1.5 rounded-full mt-1.5 overflow-hidden">
              <div
                className="bg-[#7546D8] h-full rounded-full transition-all"
                style={{ width: `${Math.min(100, (currentStudent.xpPoints % 500) / 5)}%` }}
              />
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};
