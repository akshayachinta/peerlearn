import React, { useState } from 'react';
import { X, Calendar, Clock, Video, MapPin, CheckCircle2, AlertCircle } from 'lucide-react';
import { Student } from '../types';
import { storage } from '../services/storage';

interface ScheduleSessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedPeerId?: string;
  defaultSkillName?: string;
  onSessionScheduled: () => void;
}

export const ScheduleSessionModal: React.FC<ScheduleSessionModalProps> = ({
  isOpen,
  onClose,
  preselectedPeerId = '',
  defaultSkillName = '',
  onSessionScheduled,
}) => {
  const currentStudent = storage.getCurrentStudent();
  const acceptedRequests = currentStudent
    ? storage.getRequestsForStudent(currentStudent.id).accepted
    : [];

  // Get distinct list of accepted peers
  const acceptedPeerIds = Array.from(
    new Set(
      acceptedRequests.map(r => (r.senderId === currentStudent?.id ? r.receiverId : r.senderId))
    )
  );
  const acceptedPeers = acceptedPeerIds
    .map(id => storage.getStudentById(id))
    .filter((s): s is Student => Boolean(s));

  const [peerId, setPeerId] = useState(preselectedPeerId || acceptedPeers[0]?.id || '');
  const [skillName, setSkillName] = useState(defaultSkillName || 'Python');
  const [date, setDate] = useState('2026-11-05');
  const [time, setTime] = useState('17:00');
  const [durationMinutes, setDurationMinutes] = useState(60);
  const [mode, setMode] = useState<'Online' | 'Offline'>('Online');
  const [venueOrLink, setVenueOrLink] = useState('https://meet.google.com/peer-learn-session');
  const [description, setDescription] = useState('Peer skill exchange session focusing on practical implementation and problem solving.');
  const [iAmTeaching, setIAmTeaching] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  if (!isOpen || !currentStudent) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!peerId) {
      setError('Please select an accepted peer student to schedule with.');
      return;
    }

    if (!date || !time) {
      setError('Please specify both date and time.');
      return;
    }

    try {
      storage.scheduleSession({
        peerStudentId: peerId,
        skillName,
        date,
        time,
        durationMinutes,
        mode,
        meetingLinkOrVenue: venueOrLink.trim() || (mode === 'Online' ? 'https://meet.google.com/peer-session' : 'Campus Central Library Lab 3'),
        description,
        iAmTeaching,
      });

      setSuccess(true);
      setTimeout(() => {
        onSessionScheduled();
        onClose();
      }, 1300);
    } catch (err: any) {
      setError(err.message || 'Could not schedule session.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-[#E9DDFC]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-[#F8F7FC]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#7546D8] text-white flex items-center justify-center">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#202033]">Schedule Learning Session</h2>
              <p className="text-xs text-[#77758A]">Arrange a structured 1-on-1 peer exchange session</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
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
              <p className="text-base font-bold text-[#202033]">Session Scheduled!</p>
              <p className="text-xs text-[#77758A]">
                Calendar invite and notification sent. Complete this session to earn +100 XP!
              </p>
            </div>
          ) : (
            <>
              {acceptedPeers.length === 0 ? (
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800">
                  <p className="font-bold">No Accepted Connections Yet</p>
                  <p className="mt-1">
                    You can only schedule learning sessions with students after an exchange request has been accepted. Go to Smart Matching or Talent Profiles to propose a connection first!
                  </p>
                </div>
              ) : (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-[#202033] mb-1">
                      Select Connected Peer
                    </label>
                    <select
                      value={peerId}
                      onChange={e => setPeerId(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:border-[#7546D8] bg-white"
                    >
                      {acceptedPeers.map(p => (
                        <option key={p.id} value={p.id}>
                          {p.name} ({p.collegeName} · {p.branch})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#202033] mb-1">Session Direction</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setIAmTeaching(true)}
                        className={`p-2.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                          iAmTeaching
                            ? 'border-[#7546D8] bg-[#E9DDFC] text-[#5425A8]'
                            : 'border-gray-200 text-[#77758A] hover:bg-gray-50'
                        }`}
                      >
                        I am teaching them
                      </button>
                      <button
                        type="button"
                        onClick={() => setIAmTeaching(false)}
                        className={`p-2.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                          !iAmTeaching
                            ? 'border-[#7546D8] bg-[#E9DDFC] text-[#5425A8]'
                            : 'border-gray-200 text-[#77758A] hover:bg-gray-50'
                        }`}
                      >
                        They are teaching me
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#202033] mb-1">Skill Topic</label>
                    <input
                      type="text"
                      required
                      value={skillName}
                      onChange={e => setSkillName(e.target.value)}
                      placeholder="e.g. Python, Java, Docker, Machine Learning"
                      className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:border-[#7546D8]"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block text-xs font-semibold text-[#202033] mb-1">Date</label>
                      <input
                        type="date"
                        required
                        value={date}
                        onChange={e => setDate(e.target.value)}
                        className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:border-[#7546D8]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#202033] mb-1">Time</label>
                      <input
                        type="time"
                        required
                        value={time}
                        onChange={e => setTime(e.target.value)}
                        className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:border-[#7546D8]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#202033] mb-1">Duration</label>
                      <select
                        value={durationMinutes}
                        onChange={e => setDurationMinutes(Number(e.target.value))}
                        className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:border-[#7546D8] bg-white"
                      >
                        <option value={30}>30 mins</option>
                        <option value={45}>45 mins</option>
                        <option value={60}>60 mins</option>
                        <option value={90}>90 mins</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#202033] mb-1">Mode &amp; Location</label>
                    <div className="flex gap-2 mb-2">
                      <button
                        type="button"
                        onClick={() => {
                          setMode('Online');
                          setVenueOrLink('https://meet.google.com/peer-learn-session');
                        }}
                        className={`flex-1 py-1.5 text-xs font-semibold rounded-xl border flex items-center justify-center gap-1.5 cursor-pointer ${
                          mode === 'Online'
                            ? 'border-[#7546D8] bg-[#E9DDFC] text-[#5425A8]'
                            : 'border-gray-200 text-[#77758A]'
                        }`}
                      >
                        <Video className="w-3.5 h-3.5" />
                        <span>Online (Google Meet / Zoom)</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setMode('Offline');
                          setVenueOrLink('Campus Central Library, Study Room B');
                        }}
                        className={`flex-1 py-1.5 text-xs font-semibold rounded-xl border flex items-center justify-center gap-1.5 cursor-pointer ${
                          mode === 'Offline'
                            ? 'border-[#7546D8] bg-[#E9DDFC] text-[#5425A8]'
                            : 'border-gray-200 text-[#77758A]'
                        }`}
                      >
                        <MapPin className="w-3.5 h-3.5" />
                        <span>Offline (Campus / Lab)</span>
                      </button>
                    </div>
                    <input
                      type="text"
                      value={venueOrLink}
                      onChange={e => setVenueOrLink(e.target.value)}
                      placeholder={mode === 'Online' ? 'Meeting URL (e.g. https://meet.google.com/...)' : 'Campus room / lab location'}
                      className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:border-[#7546D8]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#202033] mb-1">Session Agenda / Description</label>
                    <textarea
                      rows={2}
                      value={description}
                      onChange={e => setDescription(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:border-[#7546D8]"
                    />
                  </div>

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
                      className="px-5 py-2.5 bg-[#7546D8] hover:bg-[#5425A8] text-white text-xs font-bold rounded-xl shadow-md transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Confirm Session</span>
                    </button>
                  </div>
                </>
              )}
            </>
          )}
        </form>
      </div>
    </div>
  );
};
