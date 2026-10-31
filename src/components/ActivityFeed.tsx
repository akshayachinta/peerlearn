import React, { useState } from 'react';
import {
  Activity,
  Sparkles,
  ArrowRightLeft,
  CheckCircle2,
  Calendar,
  Award,
  Filter
} from 'lucide-react';
import { ActivityLog } from '../types';
import { storage } from '../services/storage';

export const ActivityFeed: React.FC = () => {
  const [filterType, setFilterType] = useState<string>('ALL');
  const activities = storage.getActivities(50);

  const filtered = activities.filter(a => {
    if (filterType !== 'ALL' && a.type !== filterType) return false;
    return true;
  });

  const getIcon = (type: ActivityLog['type']) => {
    switch (type) {
      case 'MATCH':
        return <Sparkles className="w-4 h-4 text-amber-500" />;
      case 'REQUEST':
        return <ArrowRightLeft className="w-4 h-4 text-[#7546D8]" />;
      case 'ACCEPT':
        return <CheckCircle2 className="w-4 h-4 text-[#16A36A]" />;
      case 'SESSION_SCHEDULED':
        return <Calendar className="w-4 h-4 text-blue-500" />;
      case 'SESSION_COMPLETED':
        return <Award className="w-4 h-4 text-[#16A36A]" />;
      case 'SKILL_ADDED':
        return <Award className="w-4 h-4 text-[#5425A8]" />;
      default:
        return <Activity className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Activity className="w-5 h-5 text-[#7546D8]" />
            <h1 className="text-xl font-extrabold text-[#202033]">Campus Activity Feed</h1>
          </div>
          <p className="text-xs text-[#77758A]">
            Real-time feed of skill discoveries, mutual matches, accepted proposals, and completed sessions across the student body.
          </p>
        </div>

        {/* Filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-gray-400" />
          <select
            value={filterType}
            onChange={e => setFilterType(e.target.value)}
            className="px-3 py-1.5 text-xs border border-gray-200 rounded-xl focus:outline-none focus:border-[#7546D8] bg-white text-[#202033]"
          >
            <option value="ALL">All Events</option>
            <option value="MATCH">Mutual Matches</option>
            <option value="REQUEST">Exchange Requests</option>
            <option value="ACCEPT">Accepted Connections</option>
            <option value="SESSION_COMPLETED">Completed Sessions</option>
            <option value="SKILL_ADDED">Skills Added</option>
          </select>
        </div>
      </div>

      {/* Timeline */}
      <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs">
        {filtered.length === 0 ? (
          <p className="text-center py-10 text-xs text-[#77758A]">No activities found for this filter.</p>
        ) : (
          <div className="space-y-6 relative before:absolute before:inset-0 before:left-5 before:w-0.5 before:bg-gray-100">
            {filtered.map(act => (
              <div key={act.id} className="relative flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#FAF9FD] border border-[#E9DDFC] flex items-center justify-center shrink-0 z-10 shadow-xs">
                  {getIcon(act.type)}
                </div>
                <div className="flex-1 bg-[#F8F7FC] p-4 rounded-2xl border border-gray-100">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-xs font-bold text-[#202033]">{act.title}</h3>
                    <span className="text-[10px] text-gray-400 font-mono">{act.timestamp}</span>
                  </div>
                  <p className="text-xs text-[#77758A] mt-1 leading-relaxed">
                    {act.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
