import React, { useState } from 'react';
import {
  ArrowRightLeft,
  CheckCircle2,
  XCircle,
  Clock,
  Calendar,
  Send,
  Inbox,
  Check,
  X,
  Repeat,
  AlertCircle
} from 'lucide-react';
import { Student, ExchangeRequest } from '../types';
import { storage } from '../services/storage';

interface ExchangeRequestsProps {
  currentStudent: Student | null;
  onScheduleSession: (peerId?: string, defaultSkill?: string) => void;
  onRequestsUpdated: () => void;
}

export const ExchangeRequests: React.FC<ExchangeRequestsProps> = ({
  currentStudent,
  onScheduleSession,
  onRequestsUpdated,
}) => {
  const [activeTab, setActiveTab] = useState<'INCOMING' | 'SENT' | 'ACCEPTED' | 'HISTORY'>('INCOMING');

  if (!currentStudent) return null;

  const allRequests = storage.getRequests();
  const incoming = allRequests.filter(r => r.receiverId === currentStudent.id && r.status === 'PENDING');
  const sent = allRequests.filter(r => r.senderId === currentStudent.id && r.status === 'PENDING');
  const accepted = allRequests.filter(
    r => (r.senderId === currentStudent.id || r.receiverId === currentStudent.id) && r.status === 'ACCEPTED'
  );
  const history = allRequests.filter(
    r =>
      (r.senderId === currentStudent.id || r.receiverId === currentStudent.id) &&
      (r.status === 'REJECTED' || r.status === 'CANCELLED')
  );

  const handleAccept = (reqId: string) => {
    storage.acceptExchangeRequest(reqId);
    onRequestsUpdated();
  };

  const handleReject = (reqId: string) => {
    storage.rejectExchangeRequest(reqId);
    onRequestsUpdated();
  };

  const handleCancel = (reqId: string) => {
    storage.cancelExchangeRequest(reqId);
    onRequestsUpdated();
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <ArrowRightLeft className="w-5 h-5 text-[#7546D8]" />
            <h1 className="text-xl font-extrabold text-[#202033]">Peer Exchange Requests</h1>
          </div>
          <p className="text-xs text-[#77758A]">
            Manage incoming proposals, monitor sent requests, and view accepted connections to schedule learning sessions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-[#5425A8] bg-[#E9DDFC] px-3 py-1.5 rounded-xl font-mono">
            {incoming.length} Incoming Pending
          </span>
          <span className="text-xs font-bold text-[#16A36A] bg-green-50 px-3 py-1.5 rounded-xl font-mono">
            {accepted.length} Connected
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 bg-white rounded-2xl border border-gray-100 shadow-xs">
        <button
          onClick={() => setActiveTab('INCOMING')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'INCOMING'
              ? 'bg-[#7546D8] text-white shadow-sm'
              : 'text-[#77758A] hover:text-[#202033]'
          }`}
        >
          <Inbox className="w-3.5 h-3.5" />
          <span>Incoming Requests ({incoming.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('SENT')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'SENT'
              ? 'bg-[#7546D8] text-white shadow-sm'
              : 'text-[#77758A] hover:text-[#202033]'
          }`}
        >
          <Send className="w-3.5 h-3.5" />
          <span>Sent Requests ({sent.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('ACCEPTED')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'ACCEPTED'
              ? 'bg-[#16A36A] text-white shadow-sm'
              : 'text-[#77758A] hover:text-[#202033]'
          }`}
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Accepted Connections ({accepted.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('HISTORY')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'HISTORY'
              ? 'bg-gray-800 text-white shadow-sm'
              : 'text-[#77758A] hover:text-[#202033]'
          }`}
        >
          <span>History ({history.length})</span>
        </button>
      </div>

      {/* Requests Content */}
      {activeTab === 'INCOMING' && (
        <div className="space-y-4">
          {incoming.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 space-y-2">
              <Inbox className="w-10 h-10 text-gray-300 mx-auto" />
              <p className="text-sm font-bold text-[#202033]">No pending incoming exchange requests</p>
              <p className="text-xs text-[#77758A]">
                When fellow students discover your skills and propose an exchange, their requests will appear here.
              </p>
            </div>
          ) : (
            incoming.map(req => (
              <div
                key={req.id}
                className="bg-white rounded-2xl p-5 border border-[#E9DDFC] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white text-sm"
                      style={{ backgroundColor: req.senderAvatarBg || '#7546D8' }}
                    >
                      {req.senderName.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-[#202033]">{req.senderName}</h3>
                      <p className="text-[11px] text-[#77758A]">{req.senderCollege}</p>
                    </div>
                  </div>

                  {/* Skills Exchange Pair */}
                  <div className="flex flex-wrap items-center gap-2 text-xs bg-[#FAF9FD] p-3 rounded-xl border border-gray-100">
                    <span className="text-[#16A36A] font-bold">They will teach you: {req.teachingSkill}</span>
                    <span className="text-gray-400">⇄</span>
                    <span className="text-[#7546D8] font-bold">You will teach them: {req.learningSkill}</span>
                    <span className="text-gray-400">·</span>
                    <span className="text-[#77758A]">Mode: {req.preferredMode}</span>
                  </div>

                  {req.message && (
                    <p className="text-xs text-[#77758A] italic">"{req.message}"</p>
                  )}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleReject(req.id)}
                    className="px-4 py-2 border border-gray-200 text-[#77758A] hover:bg-red-50 hover:text-red-600 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                  >
                    Decline
                  </button>
                  <button
                    onClick={() => handleAccept(req.id)}
                    className="px-5 py-2 bg-[#7546D8] hover:bg-[#5425A8] text-white rounded-xl text-xs font-bold shadow-sm transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <Check className="w-4 h-4" />
                    <span>Accept Exchange</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === 'SENT' && (
        <div className="space-y-4">
          {sent.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 space-y-2">
              <Send className="w-10 h-10 text-gray-300 mx-auto" />
              <p className="text-sm font-bold text-[#202033]">No pending sent requests</p>
              <p className="text-xs text-[#77758A]">Browse Talent Profiles or Smart Matching to propose new exchanges.</p>
            </div>
          ) : (
            sent.map(req => (
              <div
                key={req.id}
                className="bg-white rounded-2xl p-5 border border-gray-100 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white text-sm"
                      style={{ backgroundColor: req.receiverAvatarBg || '#5425A8' }}
                    >
                      {req.receiverName.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-[#202033]">{req.receiverName}</h3>
                      <p className="text-[11px] text-[#77758A]">{req.receiverCollege}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 text-xs bg-[#FAF9FD] p-3 rounded-xl border border-gray-100">
                    <span className="text-[#16A36A] font-bold">You offer: {req.teachingSkill}</span>
                    <span className="text-gray-400">⇄</span>
                    <span className="text-[#7546D8] font-bold">You want: {req.learningSkill}</span>
                    <span className="text-gray-400">·</span>
                    <span className="text-amber-600 font-semibold flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>Awaiting Peer Response</span>
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleCancel(req.id)}
                    className="px-4 py-2 border border-gray-200 text-red-600 hover:bg-red-50 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                  >
                    Cancel Request
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === 'ACCEPTED' && (
        <div className="space-y-4">
          {accepted.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 space-y-2">
              <CheckCircle2 className="w-10 h-10 text-gray-300 mx-auto" />
              <p className="text-sm font-bold text-[#202033]">No accepted connections yet</p>
              <p className="text-xs text-[#77758A]">
                Once a request is accepted, both students can schedule structured learning sessions.
              </p>
            </div>
          ) : (
            accepted.map(req => {
              const otherStudentId = req.senderId === currentStudent.id ? req.receiverId : req.senderId;
              const otherStudentName = req.senderId === currentStudent.id ? req.receiverName : req.senderName;
              const otherStudentCollege = req.senderId === currentStudent.id ? req.receiverCollege : req.senderCollege;

              return (
                <div
                  key={req.id}
                  className="bg-white rounded-2xl p-5 border border-green-200 bg-green-50/10 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#16A36A] flex items-center justify-center font-bold text-white text-sm">
                        {otherStudentName.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-bold text-[#202033]">{otherStudentName}</h3>
                          <span className="text-[10px] bg-green-100 text-[#16A36A] font-bold px-2 py-0.5 rounded-full">
                            Connected Peer
                          </span>
                        </div>
                        <p className="text-[11px] text-[#77758A]">{otherStudentCollege}</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 text-xs bg-white p-3 rounded-xl border border-gray-100">
                      <span className="text-[#16A36A] font-bold">Skills: {req.teachingSkill} ⇄ {req.learningSkill}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => onScheduleSession(otherStudentId, req.learningSkill)}
                      className="px-5 py-2.5 bg-[#7546D8] hover:bg-[#5425A8] text-white rounded-xl text-xs font-bold shadow-sm transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Schedule Learning Session</span>
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {activeTab === 'HISTORY' && (
        <div className="space-y-4">
          {history.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-gray-100">
              <p className="text-sm font-bold text-[#202033]">No past rejected or cancelled requests</p>
            </div>
          ) : (
            history.map(req => (
              <div key={req.id} className="bg-white rounded-2xl p-4 border border-gray-100 text-xs text-[#77758A] flex items-center justify-between">
                <div>
                  <span className="font-bold text-[#202033]">{req.senderName} ⇄ {req.receiverName}</span>
                  <span className="ml-2">({req.teachingSkill} for {req.learningSkill})</span>
                </div>
                <span className="font-semibold text-red-600 bg-red-50 px-2.5 py-0.5 rounded-full uppercase text-[10px]">
                  {req.status}
                </span>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
