import React, { useState } from 'react';
import { X, Download, Terminal, Code2, FolderGit2, CheckCircle2, Copy, ExternalLink } from 'lucide-react';
import { getSpringBootProjectFiles, downloadSpringBootProjectZip, CodeFile } from '../services/springBootTemplate';

interface DevOpsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DevOpsModal: React.FC<DevOpsModalProps> = ({ isOpen, onClose }) => {
  const [files] = useState<CodeFile[]>(getSpringBootProjectFiles());
  const [selectedFile, setSelectedFile] = useState<CodeFile>(files[0]);
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadZip = async () => {
    try {
      setDownloading(true);
      await downloadSpringBootProjectZip();
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl h-[88vh] flex flex-col overflow-hidden border border-[#E9DDFC]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-[#F8F7FC]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#7546D8] text-white flex items-center justify-center shadow-md">
              <FolderGit2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-[#202033]">PeerLearn Java 21 & Spring Boot Project</h2>
                <span className="text-[11px] font-semibold bg-[#E9DDFC] text-[#5425A8] px-2 py-0.5 rounded-full">
                  DevOps Academic Case Study
                </span>
              </div>
              <p className="text-xs text-[#77758A]">
                Full Maven Spring Boot 3.3, JPA Entities, MySQL DDL, Spring Security & Windows 11 commands
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleDownloadZip}
              disabled={downloading}
              className="flex items-center gap-2 px-4 py-2 bg-[#7546D8] hover:bg-[#5425A8] text-white rounded-xl text-xs font-semibold shadow-sm transition-all cursor-pointer disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              <span>{downloading ? 'Packaging ZIP...' : 'Download Project ZIP (Windows 11)'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Windows 11 Quick Banner */}
        <div className="bg-[#5425A8] text-white px-6 py-2.5 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-[#A78BFA]" />
            <span className="font-medium">Windows 11 Quick Run:</span>
            <code className="bg-black/30 px-2 py-0.5 rounded text-[#E9DDFC] font-mono">
              mvn clean install &amp;&amp; mvn spring-boot:run
            </code>
          </div>
          <span className="text-[#E9DDFC] hidden sm:inline">MySQL Database: peerlearn_db on port 3306</span>
        </div>

        {/* Explorer Body */}
        <div className="flex-1 flex overflow-hidden">
          {/* File Tree Sidebar */}
          <div className="w-64 border-r border-gray-100 bg-[#FAF9FD] p-3 overflow-y-auto">
            <p className="text-[11px] font-bold text-[#77758A] uppercase tracking-wider mb-2 px-2">Project Files</p>
            <div className="space-y-1">
              {files.map(file => {
                const isSelected = selectedFile.path === file.path;
                return (
                  <button
                    key={file.path}
                    onClick={() => setSelectedFile(file)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-colors flex items-center gap-2 cursor-pointer ${
                      isSelected
                        ? 'bg-[#E9DDFC] text-[#5425A8] font-semibold'
                        : 'text-[#202033] hover:bg-gray-100'
                    }`}
                  >
                    <Code2 className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-[#7546D8]' : 'text-gray-400'}`} />
                    <span className="truncate">{file.name}</span>
                  </button>
                );
              })}
            </div>

            <div className="mt-6 p-3 bg-white rounded-xl border border-[#E9DDFC] text-xs">
              <p className="font-bold text-[#202033] mb-1">Architecture Note</p>
              <p className="text-[#77758A] leading-relaxed text-[11px]">
                Configured with Spring Data JPA entities, BCrypt password encryption, Spring Security role rules, and exact mutual skill matching algorithm.
              </p>
            </div>
          </div>

          {/* Code View Area */}
          <div className="flex-1 flex flex-col bg-[#1E1E2E] text-gray-200 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2 bg-[#181825] border-b border-gray-800 text-xs">
              <span className="font-mono text-[#A78BFA]">{selectedFile.path}</span>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-2.5 py-1 bg-white/10 hover:bg-white/20 text-xs rounded transition-colors cursor-pointer"
              >
                {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied!' : 'Copy Code'}</span>
              </button>
            </div>

            <pre className="flex-1 p-4 font-mono text-xs overflow-auto leading-relaxed text-gray-300">
              <code>{selectedFile.content}</code>
            </pre>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-gray-100 bg-white flex items-center justify-between text-xs text-[#77758A]">
          <span>Includes complete models: Student, StudentSkill, ExchangeRequest, LearningSession, MatchingService</span>
          <button
            onClick={handleDownloadZip}
            className="text-[#7546D8] font-semibold hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>Download All in 1 ZIP</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
