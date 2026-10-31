import React, { useState } from 'react';
import { X, Lock, Mail, User, School, BookOpen, Calendar, ArrowRight, ShieldCheck, Sparkles, Eye, EyeOff, KeyRound, Check } from 'lucide-react';
import { api, AuthResponse } from '../services/api';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'LOGIN' | 'REGISTER' | 'ADMIN';
  onSuccess: (role: 'STUDENT' | 'ADMIN') => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'LOGIN',
  onSuccess,
}) => {
  const [mode, setMode] = useState<'LOGIN' | 'REGISTER' | 'ADMIN'>(initialMode);
  const [error, setError] = useState<string | null>(null);

  // Login Form
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Register Form
  const [fullName, setFullName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [collegeName, setCollegeName] = useState('Vasavi College of Engineering');
  const [branch, setBranch] = useState('Computer Science & Engineering');
  const [academicYear, setAcademicYear] = useState('3rd Year');
  const [bio, setBio] = useState('');

  // Admin Form
  const [adminEmail, setAdminEmail] = useState('admin@peerlearn.edu');
  const [adminPassword, setAdminPassword] = useState('Admin@123');
  const [showAdminPassword, setShowAdminPassword] = useState(false);

  if (!isOpen) return null;

  const completeAuthentication = (result: AuthResponse) => {
    // Keep the real backend identity available for App.tsx to hydrate the dashboard.
    localStorage.setItem('peerlearn_api_student', JSON.stringify(result));
    localStorage.setItem('peerlearn_api_student_id', String(result.studentId));
    localStorage.setItem('peerlearn_api_role', result.role || 'ROLE_STUDENT');
    onSuccess(result.role === 'ROLE_ADMIN' ? 'ADMIN' : 'STUDENT');
    onClose();
  };

  const handleStudentLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const result = await api.login(loginEmail.trim().toLowerCase(), loginPassword);
      if (!result.success) {
        setError(result.message || 'Login failed. Please check your details.');
        return;
      }
      completeAuthentication(result);
    } catch (err: any) {
      setError(err.message || 'Unable to connect to the server. Please try again.');
    }
  };

  const handleQuickLogin = (_studentId: string) => {
    setError('Demo accounts are disabled. Please sign in using a registered backend account.');
  };

  const handleStudentRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!fullName.trim() || !registerEmail.trim() || !registerPassword.trim()) {
      setError('Please fill in all mandatory fields.');
      return;
    }

    if (registerPassword.length < 6) {
      setError('Password must contain at least 6 characters.');
      return;
    }

    try {
      const result = await api.register({
        fullName: fullName.trim(),
        email: registerEmail.trim().toLowerCase(),
        password: registerPassword,
        collegeName: collegeName.trim(),
        branch: branch.trim(),
        academicYear,
        bio: bio.trim() || 'Excited to exchange technical and creative skills with fellow students!',
      });

      if (!result.success) {
        setError(result.message || 'Registration failed.');
        return;
      }

      // Registration creates the account; login immediately to establish the session cookie.
      const loginResult = await api.login(registerEmail.trim().toLowerCase(), registerPassword);
      if (!loginResult.success) {
        setError('Account created successfully. Please sign in with your new credentials.');
        setMode('LOGIN');
        setLoginEmail(registerEmail.trim().toLowerCase());
        return;
      }
      completeAuthentication(loginResult);
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
    }
  };

  const handleAdminLogin = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setError(null);
    try {
      const result = await api.login(adminEmail.trim().toLowerCase(), adminPassword);
      if (!result.success || result.role !== 'ROLE_ADMIN') {
        setError('Invalid administrator credentials or this account does not have administrator access.');
        return;
      }
      completeAuthentication(result);
    } catch (err: any) {
      setError(err.message || 'Unable to connect to the server.');
    }
  };

  const handle1ClickAdmin = () => {
    setError('One-click demo administrator access is disabled. Please use your real administrator account.');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-[#E9DDFC]">
        {/* Header Tabs */}
        <div className="p-6 pb-4 border-b border-gray-100 bg-[#F8F7FC] relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-[#7546D8] text-white flex items-center justify-center font-bold text-sm shadow">
              PL
            </div>
            <span className="font-bold text-[#202033] text-lg">PeerLearn</span>
          </div>

          {mode === 'ADMIN' ? (
            <div className="flex items-center justify-between p-2 bg-[#FAF9FD] rounded-xl border border-[#E9DDFC]">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#5425A8]">
                <ShieldCheck className="w-4 h-4 text-[#7546D8]" />
                <span>Administrator Authentication</span>
              </div>
              <button
                type="button"
                onClick={() => { setMode('LOGIN'); setError(null); }}
                className="text-xs text-[#7546D8] hover:underline font-semibold cursor-pointer"
              >
                ← Back to Student Login
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1 p-1 bg-white rounded-xl border border-gray-200">
              <button
                onClick={() => { setMode('LOGIN'); setError(null); }}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  mode === 'LOGIN' ? 'bg-[#7546D8] text-white shadow-sm' : 'text-[#77758A] hover:text-[#202033]'
                }`}
              >
                Student Login
              </button>
              <button
                onClick={() => { setMode('REGISTER'); setError(null); }}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  mode === 'REGISTER' ? 'bg-[#7546D8] text-white shadow-sm' : 'text-[#77758A] hover:text-[#202033]'
                }`}
              >
                Register
              </button>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700">
              {error}
            </div>
          )}

          {mode === 'LOGIN' && (
            <div>
              <form onSubmit={handleStudentLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[#202033] mb-1">Student Email</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                    <input
                      type="email"
                      required
                      placeholder="e.g. chintaassrija@gmail.com"
                      value={loginEmail}
                      onChange={e => setLoginEmail(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:border-[#7546D8] focus:ring-2 focus:ring-[#E9DDFC]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#202033] mb-1">Password</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={loginPassword}
                      onChange={e => setLoginPassword(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:border-[#7546D8] focus:ring-2 focus:ring-[#E9DDFC]"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-[#7546D8] hover:bg-[#5425A8] text-white text-xs font-bold rounded-xl shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Sign In as Student</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              {/* Instant Demo Switcher */}
              <div className="mt-6 pt-5 border-t border-gray-100">
                <div className="flex items-center gap-1.5 mb-2.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#7546D8]" />
                  <span className="text-[11px] font-bold text-[#77758A] uppercase tracking-wider">
                    Instant Demo Accounts (1-Click)
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleQuickLogin('student-srija')}
                    className="p-2.5 text-left border border-[#E9DDFC] bg-[#FAF9FD] hover:bg-[#E9DDFC]/50 rounded-xl transition-all cursor-pointer"
                  >
                    <p className="text-xs font-bold text-[#5425A8]">Srija Chinta</p>
                    <p className="text-[10px] text-[#77758A]">Teaches Python ⇄ Wants Java</p>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickLogin('student-rahul')}
                    className="p-2.5 text-left border border-[#E9DDFC] bg-[#FAF9FD] hover:bg-[#E9DDFC]/50 rounded-xl transition-all cursor-pointer"
                  >
                    <p className="text-xs font-bold text-[#5425A8]">Rahul Verma</p>
                    <p className="text-[10px] text-[#77758A]">Teaches Java ⇄ Wants Python</p>
                  </button>
                </div>

                <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-[11px] text-[#77758A]">
                  <span>System Administrator?</span>
                  <button
                    type="button"
                    onClick={() => { setMode('ADMIN'); setError(null); }}
                    className="text-[#5425A8] hover:underline font-bold cursor-pointer"
                  >
                    Administrator Login →
                  </button>
                </div>
              </div>
            </div>
          )}

          {mode === 'REGISTER' && (
            <form onSubmit={handleStudentRegister} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-[#202033] mb-1">Full Name *</label>
                <div className="relative">
                  <User className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Priya Sharma"
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:border-[#7546D8]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#202033] mb-1">Student Email *</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                  <input
                    type="email"
                    required
                    placeholder="e.g. priya.sharma@college.edu"
                    value={registerEmail}
                    onChange={e => setRegisterEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:border-[#7546D8]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#202033] mb-1">Password *</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                  <input
                    type="password"
                    required
                    placeholder="Create a secure password"
                    value={registerPassword}
                    onChange={e => setRegisterPassword(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:border-[#7546D8]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-[#202033] mb-1">College</label>
                  <input
                    type="text"
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
                    className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:border-[#7546D8]"
                  >
                    <option>1st Year</option>
                    <option>2nd Year</option>
                    <option>3rd Year</option>
                    <option>4th Year</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#202033] mb-1">Branch / Major</label>
                <input
                  type="text"
                  value={branch}
                  onChange={e => setBranch(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:border-[#7546D8]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#202033] mb-1">Short Bio</label>
                <textarea
                  rows={2}
                  placeholder="What are your technical goals?"
                  value={bio}
                  onChange={e => setBio(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-gray-200 rounded-xl focus:outline-none focus:border-[#7546D8]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-[#7546D8] hover:bg-[#5425A8] text-white text-xs font-bold rounded-xl shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                <span>Create Student Account</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {mode === 'ADMIN' && (
            <div>
              <div className="mb-4 p-3 bg-purple-50 border border-purple-200 rounded-xl flex items-start gap-2.5">
                <ShieldCheck className="w-5 h-5 text-[#5425A8] shrink-0 mt-0.5" />
                <div className="text-xs text-[#5425A8]">
                  <p className="font-bold">Administrator Credentials Reference</p>
                  <p className="text-[11px] text-[#77758A] mt-0.5">
                    Email: <code className="font-mono font-semibold text-[#5425A8] bg-white px-1.5 py-0.5 rounded border border-purple-200">admin@peerlearn.edu</code>
                  </p>
                  <p className="text-[11px] text-[#77758A] mt-0.5">
                    Password: <code className="font-mono font-semibold text-[#5425A8] bg-white px-1.5 py-0.5 rounded border border-purple-200">Admin@123</code> (Capital 'A' and '@' sign)
                  </p>
                </div>
              </div>

              {/* 1-Click Fast Admin Access */}
              <button
                type="button"
                onClick={handle1ClickAdmin}
                className="w-full mb-4 py-2 px-3 bg-gradient-to-r from-[#5425A8] to-[#7546D8] hover:from-[#431d87] hover:to-[#6339bc] text-white text-xs font-bold rounded-xl shadow transition-all flex items-center justify-center gap-2 cursor-pointer group"
              >
                <Sparkles className="w-4 h-4 text-amber-300 group-hover:scale-110 transition-transform" />
                <span>⚡ 1-Click Instant Sign In as Admin</span>
              </button>

              <div className="relative my-3 text-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200" />
                </div>
                <span className="relative bg-white px-2 text-[10px] uppercase font-bold text-gray-400">
                  Or enter credentials
                </span>
              </div>

              <form onSubmit={handleAdminLogin} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold text-[#202033] mb-1">Admin Email</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      placeholder="admin@peerlearn.edu"
                      value={adminEmail}
                      onChange={e => setAdminEmail(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:border-[#5425A8] focus:ring-2 focus:ring-[#E9DDFC]"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-semibold text-[#202033]">Admin Password</label>
                    <button
                      type="button"
                      onClick={() => setShowAdminPassword(!showAdminPassword)}
                      className="text-[10px] text-[#7546D8] font-semibold hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      {showAdminPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                      <span>{showAdminPassword ? 'Hide' : 'Show password'}</span>
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                    <input
                      type={showAdminPassword ? 'text' : 'password'}
                      required
                      placeholder="Admin@123"
                      value={adminPassword}
                      onChange={e => setAdminPassword(e.target.value)}
                      className="w-full pl-9 pr-10 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:border-[#5425A8] focus:ring-2 focus:ring-[#E9DDFC]"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-[#5425A8] hover:bg-[#202033] text-white text-xs font-bold rounded-xl shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer mt-2"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Authenticate as Admin</span>
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
