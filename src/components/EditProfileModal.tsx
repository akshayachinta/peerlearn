import React, { useState, useEffect } from 'react';
import { X, User, School, BookOpen, Calendar, Camera, CheckCircle2, AlertCircle } from 'lucide-react';
import { Student } from '../types';
import { storage } from '../services/storage';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: Student | null;
  onProfileUpdated: () => void;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  isOpen,
  onClose,
  student,
  onProfileUpdated,
}) => {
  const [name, setName] = useState('');
  const [collegeName, setCollegeName] = useState('');
  const [branch, setBranch] = useState('');
  const [academicYear, setAcademicYear] = useState('3rd Year');
  const [bio, setBio] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [availability, setAvailability] = useState<'Available' | 'Busy' | 'Weekends Only'>('Available');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (student) {
      setName(student.name);
      setCollegeName(student.collegeName);
      setBranch(student.branch);
      setAcademicYear(student.academicYear);
      setBio(student.bio || '');
      setAvatarUrl(student.avatarUrl || '');
      setAvailability(student.availability);
      setError(null);
      setSuccess(false);
    }
  }, [student, isOpen]);

  if (!isOpen || !student) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim() || !collegeName.trim() || !branch.trim()) {
      setError('Name, College Name, and Branch are required.');
      return;
    }

    try {
      storage.updateStudent(student.id, {
        name: name.trim(),
        collegeName: collegeName.trim(),
        branch: branch.trim(),
        academicYear,
        bio: bio.trim(),
        avatarUrl: avatarUrl.trim() || undefined,
        availability,
      });

      setSuccess(true);
      setTimeout(() => {
        onProfileUpdated();
        onClose();
      }, 1000);
    } catch (err: any) {
      setError(err.message || 'Failed to update profile.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-[#E9DDFC]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-[#F8F7FC]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#7546D8] text-white flex items-center justify-center">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#202033]">Edit Student Profile</h2>
              <p className="text-xs text-[#77758A]">Update your college, academic year, and bio</p>
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
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-xl text-xs text-green-700 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-[#16A36A]" />
              <span>Profile updated successfully!</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-[#202033] mb-1">Full Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:border-[#7546D8]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#202033] mb-1">College Name</label>
              <input
                type="text"
                required
                value={collegeName}
                onChange={e => setCollegeName(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:border-[#7546D8]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#202033] mb-1">Academic Year</label>
              <select
                value={academicYear}
                onChange={e => setAcademicYear(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:border-[#7546D8] bg-white"
              >
                <option value="1st Year">1st Year</option>
                <option value="2nd Year">2nd Year</option>
                <option value="3rd Year">3rd Year</option>
                <option value="4th Year">4th Year</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#202033] mb-1">Branch / Major</label>
              <input
                type="text"
                required
                value={branch}
                onChange={e => setBranch(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:border-[#7546D8]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#202033] mb-1">Availability</label>
              <select
                value={availability}
                onChange={e => setAvailability(e.target.value as any)}
                className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:border-[#7546D8] bg-white"
              >
                <option value="Available">Available</option>
                <option value="Weekends Only">Weekends Only</option>
                <option value="Busy">Busy</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#202033] mb-1">Profile Picture URL (Optional)</label>
            <div className="relative">
              <Camera className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
              <input
                type="url"
                placeholder="https://example.com/photo.jpg"
                value={avatarUrl}
                onChange={e => setAvatarUrl(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:border-[#7546D8]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#202033] mb-1">Bio / Learning Philosophy</label>
            <textarea
              rows={3}
              value={bio}
              onChange={e => setBio(e.target.value)}
              placeholder="Tell other students what you're passionate about and what you hope to exchange..."
              className="w-full p-3 text-xs border border-gray-200 rounded-xl focus:outline-none focus:border-[#7546D8]"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-[#77758A] hover:bg-gray-100 rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-[#7546D8] hover:bg-[#5425A8] text-white text-xs font-bold rounded-xl shadow-md transition-colors cursor-pointer"
            >
              Save Profile Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
