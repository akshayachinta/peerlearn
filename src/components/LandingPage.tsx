import React from 'react';
import {
  GraduationCap,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Users,
  Repeat,
  Calendar,
  Award,
  ChevronRight,
  Shield,
  BookOpen,
  Code2,
  Brain,
  Rocket
} from 'lucide-react';
import { INITIAL_SKILLS } from '../data/initialData';

interface LandingPageProps {
  onGetStarted: () => void;
  onExploreSkills: () => void;
  onOpenAuth: (mode: 'LOGIN' | 'REGISTER' | 'ADMIN') => void;
  onOpenDevOps: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onGetStarted,
  onExploreSkills,
  onOpenAuth,
  onOpenDevOps,
}) => {
  return (
    <div className="min-h-screen bg-[#F8F7FC] text-[#202033] flex flex-col">
      {/* Navigation Bar */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-8">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#5425A8] to-[#7546D8] text-white flex items-center justify-center shadow-md">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight text-[#202033]">
                Peer<span className="text-[#7546D8]">Learn</span>
              </span>
              <p className="text-[10px] text-[#77758A] font-medium hidden sm:block">
                Learn Together. Grow Together.
              </p>
            </div>
          </div>

          {/* Nav Links */}
          <div className="hidden md:flex items-center gap-8 text-xs font-semibold text-[#77758A]">
            <a href="#home" className="text-[#7546D8] transition-colors">Home</a>
            <a href="#how-it-works" className="hover:text-[#202033] transition-colors">How It Works</a>
            <a href="#explore-skills" className="hover:text-[#202033] transition-colors">Explore Skills</a>
            <a href="#benefits" className="hover:text-[#202033] transition-colors">Benefits</a>
            <a href="#testimonials" className="hover:text-[#202033] transition-colors">Testimonials</a>
          </div>

          {/* Action CTAs */}
          <div className="flex items-center gap-3">
            <button
              onClick={onOpenDevOps}
              className="hidden lg:flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-[#5425A8] bg-[#FAF9FD] border border-[#E9DDFC] rounded-xl hover:bg-[#E9DDFC] transition-colors cursor-pointer"
            >
              <Code2 className="w-3.5 h-3.5 text-[#7546D8]" />
              <span>Spring Boot Source</span>
            </button>
            <button
              onClick={() => onOpenAuth('LOGIN')}
              className="px-4 py-2 text-xs font-bold text-[#7546D8] hover:bg-[#FAF9FD] rounded-xl transition-colors cursor-pointer"
            >
              Sign In
            </button>
            <button
              onClick={() => onOpenAuth('REGISTER')}
              className="px-4 py-2 text-xs font-bold bg-[#7546D8] hover:bg-[#5425A8] text-white rounded-xl shadow-md transition-all cursor-pointer"
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="relative pt-12 pb-20 overflow-hidden bg-gradient-to-b from-white to-[#F8F7FC]">
        {/* Ambient Gradient Blobs */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#E9DDFC]/50 rounded-full blur-3xl -z-10 pointer-events-none" />
        <div className="absolute top-20 left-10 w-80 h-80 bg-[#A78BFA]/20 rounded-full blur-3xl -z-10 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Heading and CTAs */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E9DDFC] text-[#5425A8] text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5 text-[#7546D8]" />
                <span>Zero-Cost Student-to-Student Skill Exchange</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#202033] tracking-tight leading-[1.15]">
                Your Skills Have Value.{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7546D8] via-[#5425A8] to-[#A78BFA]">
                  Share Them.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-[#77758A] leading-relaxed max-w-xl">
                Connect with fellow students, exchange knowledge, teach what you know, and learn what you love. No money exchanged—just pure reciprocal growth.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={onGetStarted}
                  className="px-6 py-3.5 bg-[#7546D8] hover:bg-[#5425A8] text-white text-sm font-bold rounded-xl shadow-lg shadow-[#7546D8]/25 hover:shadow-xl hover:shadow-[#7546D8]/30 transition-all flex items-center gap-2 cursor-pointer group"
                >
                  <span>Get Started Free</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
                <button
                  onClick={onExploreSkills}
                  className="px-6 py-3.5 bg-white hover:bg-[#FAF9FD] text-[#202033] border border-gray-200 text-sm font-bold rounded-xl shadow-xs transition-all cursor-pointer"
                >
                  Explore 30+ Skills
                </button>
              </div>

              {/* Trust Indicators */}
              <div className="grid grid-cols-3 gap-6 pt-6 border-t border-gray-100 text-xs">
                <div>
                  <p className="text-xl font-extrabold text-[#202033] font-mono">100%</p>
                  <p className="text-[#77758A]">Free Peer Learning</p>
                </div>
                <div>
                  <p className="text-xl font-extrabold text-[#202033] font-mono">30+ Skills</p>
                  <p className="text-[#77758A]">7 Broad Categories</p>
                </div>
                <div>
                  <p className="text-xl font-extrabold text-[#202033] font-mono">Mutual Match</p>
                  <p className="text-[#77758A]">Algorithmic Pairing</p>
                </div>
              </div>
            </div>

            {/* Right Column: Live Interactive Mutual Match Visual Demonstration */}
            <div className="lg:col-span-5">
              <div className="bg-white rounded-3xl p-6 shadow-xl border border-[#E9DDFC] relative">
                <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                  <span className="text-xs font-bold text-[#77758A] uppercase tracking-wider">
                    Smart Mutual Match Preview
                  </span>
                  <span className="text-xs font-bold bg-[#16A36A]/10 text-[#16A36A] px-2.5 py-0.5 rounded-full flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>100% Reciprocal Match</span>
                  </span>
                </div>

                {/* Match Demonstration */}
                <div className="space-y-4 py-4">
                  {/* Student A */}
                  <div className="p-3.5 bg-[#F8F7FC] rounded-2xl border border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#7546D8] text-white flex items-center justify-center font-bold text-sm shadow">
                        S
                      </div>
                      <div>
                        <p className="text-xs font-bold text-[#202033]">Srija Chinta</p>
                        <p className="text-[10px] text-[#77758A]">CSE · 3rd Year</p>
                      </div>
                    </div>
                    <div className="text-right text-[11px]">
                      <div className="text-[#16A36A] font-bold">Teaches: Python</div>
                      <div className="text-[#7546D8] font-medium">Wants: Java</div>
                    </div>
                  </div>

                  {/* Exchange Bridge */}
                  <div className="flex items-center justify-center -my-2 relative z-10">
                    <div className="w-9 h-9 rounded-full bg-[#5425A8] text-white flex items-center justify-center shadow-lg border-2 border-white">
                      <Repeat className="w-4 h-4 animate-spin-slow" />
                    </div>
                  </div>

                  {/* Student B */}
                  <div className="p-3.5 bg-[#F8F7FC] rounded-2xl border border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#5425A8] text-white flex items-center justify-center font-bold text-sm shadow">
                        R
                      </div>
                      <div>
                        <p className="text-xs font-bold text-[#202033]">Rahul Verma</p>
                        <p className="text-[10px] text-[#77758A]">IT · 3rd Year</p>
                      </div>
                    </div>
                    <div className="text-right text-[11px]">
                      <div className="text-[#16A36A] font-bold">Teaches: Java</div>
                      <div className="text-[#7546D8] font-medium">Wants: Python</div>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-[#E9DDFC]/50 rounded-xl text-center">
                  <p className="text-xs font-bold text-[#5425A8]">
                    PeerLearn algorithm paired them instantly!
                  </p>
                  <p className="text-[11px] text-[#77758A]">
                    Srija teaches Python to Rahul, while Rahul teaches Java to Srija.
                  </p>
                </div>

                <button
                  onClick={onGetStarted}
                  className="w-full mt-4 py-2.5 bg-[#7546D8] hover:bg-[#5425A8] text-white text-xs font-bold rounded-xl shadow transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Experience Smart Matching</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-white border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold text-[#7546D8] uppercase tracking-wider">
              Step-by-Step Flow
            </span>
            <h2 className="text-3xl font-extrabold text-[#202033] mt-2">
              How PeerLearn Works
            </h2>
            <p className="text-sm text-[#77758A] mt-2">
              Exchange skills seamlessly with students in your university network in four simple steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Step 1 */}
            <div className="bg-[#F8F7FC] p-6 rounded-2xl border border-gray-100 hover:border-[#E9DDFC] transition-all">
              <div className="w-12 h-12 rounded-xl bg-[#E9DDFC] text-[#5425A8] flex items-center justify-center font-bold text-lg mb-4">
                01
              </div>
              <h3 className="text-base font-bold text-[#202033] mb-2">List Your Skills</h3>
              <p className="text-xs text-[#77758A] leading-relaxed">
                Add skills you can teach (with proficiency) and skills you want to master from other students.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-[#F8F7FC] p-6 rounded-2xl border border-gray-100 hover:border-[#E9DDFC] transition-all">
              <div className="w-12 h-12 rounded-xl bg-[#E9DDFC] text-[#5425A8] flex items-center justify-center font-bold text-lg mb-4">
                02
              </div>
              <h3 className="text-base font-bold text-[#202033] mb-2">Smart Matching</h3>
              <p className="text-xs text-[#77758A] leading-relaxed">
                Our algorithm automatically calculates mutual matches where students complement each other's needs.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-[#F8F7FC] p-6 rounded-2xl border border-gray-100 hover:border-[#E9DDFC] transition-all">
              <div className="w-12 h-12 rounded-xl bg-[#E9DDFC] text-[#5425A8] flex items-center justify-center font-bold text-lg mb-4">
                03
              </div>
              <h3 className="text-base font-bold text-[#202033] mb-2">Connect &amp; Schedule</h3>
              <p className="text-xs text-[#77758A] leading-relaxed">
                Send an exchange proposal, accept requests, and schedule online (Google Meet) or offline campus sessions.
              </p>
            </div>

            {/* Step 4 */}
            <div className="bg-[#F8F7FC] p-6 rounded-2xl border border-gray-100 hover:border-[#E9DDFC] transition-all">
              <div className="w-12 h-12 rounded-xl bg-[#E9DDFC] text-[#5425A8] flex items-center justify-center font-bold text-lg mb-4">
                04
              </div>
              <h3 className="text-base font-bold text-[#202033] mb-2">Level Up &amp; Earn XP</h3>
              <p className="text-xs text-[#77758A] leading-relaxed">
                Complete learning sessions to earn verified XP points, build mutual peer connections, and unlock mentor badges.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Skill Categories */}
      <section id="explore-skills" className="py-20 bg-[#F8F7FC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <span className="text-xs font-bold text-[#7546D8] uppercase tracking-wider">
                Comprehensive Taxonomy
              </span>
              <h2 className="text-3xl font-extrabold text-[#202033] mt-2">
                Popular Skill Categories
              </h2>
              <p className="text-sm text-[#77758A] mt-1">
                Explore tech, creative, career, and communication skills offered by peer mentors.
              </p>
            </div>
            <button
              onClick={onExploreSkills}
              className="mt-4 md:mt-0 text-xs font-bold text-[#7546D8] hover:text-[#5425A8] flex items-center gap-1 cursor-pointer"
            >
              <span>View All 7 Categories</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                name: 'Programming',
                icon: Code2,
                color: '#7546D8',
                popular: ['Python', 'Java', 'C++', 'JavaScript'],
                mentors: 14,
                learners: 22
              },
              {
                name: 'Data and AI',
                icon: Brain,
                color: '#5425A8',
                popular: ['Machine Learning', 'Data Science', 'AI'],
                mentors: 9,
                learners: 18
              },
              {
                name: 'Cloud and DevOps',
                icon: Rocket,
                color: '#16A36A',
                popular: ['AWS', 'Docker', 'Kubernetes', 'Git'],
                mentors: 11,
                learners: 16
              },
              {
                name: 'Career Skills',
                icon: Award,
                color: '#F5A623',
                popular: ['Aptitude', 'Interview Prep', 'Resume Building'],
                mentors: 12,
                learners: 25
              },
              {
                name: 'Creative & Design',
                icon: Sparkles,
                color: '#A78BFA',
                popular: ['UI/UX Design', 'Canva', 'Graphic Design'],
                mentors: 8,
                learners: 15
              },
              {
                name: 'Communication',
                icon: Users,
                color: '#E05252',
                popular: ['Public Speaking', 'English Speaking', 'Presentations'],
                mentors: 7,
                learners: 13
              }
            ].map(cat => {
              const Icon = cat.icon;
              return (
                <div
                  key={cat.name}
                  onClick={onExploreSkills}
                  className="bg-white p-6 rounded-2xl border border-gray-100 hover:border-[#E9DDFC] hover:shadow-lg transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-xs"
                      style={{ backgroundColor: cat.color }}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-semibold text-[#77758A]">
                      {cat.mentors} mentors · {cat.learners} learners
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-[#202033] group-hover:text-[#7546D8] transition-colors">
                    {cat.name}
                  </h3>
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {cat.popular.map(s => (
                      <span
                        key={s}
                        className="text-[11px] px-2 py-0.5 bg-[#F8F7FC] text-[#5425A8] rounded-md font-medium"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-20 bg-white border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold text-[#7546D8] uppercase tracking-wider">
              Why Peer Learning?
            </span>
            <h2 className="text-3xl font-extrabold text-[#202033] mt-2">
              Learn Faster by Teaching &amp; Collaborating
            </h2>
            <p className="text-sm text-[#77758A] mt-2">
              The Feynman Technique proves you understand a topic best when you teach it to a peer.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 bg-[#FAF9FD] rounded-2xl border border-[#E9DDFC]">
              <div className="w-10 h-10 rounded-xl bg-[#7546D8] text-white flex items-center justify-center font-bold mb-4">
                0%
              </div>
              <h3 className="text-base font-bold text-[#202033] mb-2">Completely Free</h3>
              <p className="text-xs text-[#77758A] leading-relaxed">
                No expensive coaching or course subscriptions. Trade what you already know for skills you need.
              </p>
            </div>

            <div className="p-6 bg-[#FAF9FD] rounded-2xl border border-[#E9DDFC]">
              <div className="w-10 h-10 rounded-xl bg-[#5425A8] text-white flex items-center justify-center font-bold mb-4">
                2x
              </div>
              <h3 className="text-base font-bold text-[#202033] mb-2">Active Retention</h3>
              <p className="text-xs text-[#77758A] leading-relaxed">
                Explaining concepts to peers consolidates your understanding and makes placement interview questions effortless.
              </p>
            </div>

            <div className="p-6 bg-[#FAF9FD] rounded-2xl border border-[#E9DDFC]">
              <div className="w-10 h-10 rounded-xl bg-[#A78BFA] text-[#202033] flex items-center justify-center font-bold mb-4">
                XP
              </div>
              <h3 className="text-base font-bold text-[#202033] mb-2">Recognized Reputation</h3>
              <p className="text-xs text-[#77758A] leading-relaxed">
                Earn verifiable points and mentor badges that demonstrate leadership, communication, and technical depth.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Student Testimonials */}
      <section id="testimonials" className="py-20 bg-[#F8F7FC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold text-[#7546D8] uppercase tracking-wider">
              Student Experiences
            </span>
            <h2 className="text-3xl font-extrabold text-[#202033] mt-2">
              Loved by Students Across Campuses
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
              <p className="text-xs text-[#202033] leading-relaxed italic mb-6">
                "Finding Rahul through the automatic mutual match was a game-changer. I taught him Python algorithmic logic, and he guided me through Spring Data JPA. We both prepared for our technical rounds together!"
              </p>
              <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                <div className="w-9 h-9 rounded-full bg-[#7546D8] text-white font-bold flex items-center justify-center text-xs">
                  S
                </div>
                <div>
                  <p className="text-xs font-bold text-[#202033]">Srija Chinta</p>
                  <p className="text-[10px] text-[#77758A]">CSE · Vasavi College</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
              <p className="text-xs text-[#202033] leading-relaxed italic mb-6">
                "Vikram helped me containerize my first Spring Boot application using Docker in a 1-hour peer session. Getting feedback from a student who already did an internship was 10x better than reading tutorials."
              </p>
              <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                <div className="w-9 h-9 rounded-full bg-[#5425A8] text-white font-bold flex items-center justify-center text-xs">
                  R
                </div>
                <div>
                  <p className="text-xs font-bold text-[#202033]">Rahul Verma</p>
                  <p className="text-[10px] text-[#77758A]">IT · CBIT Hyderabad</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
              <p className="text-xs text-[#202033] leading-relaxed italic mb-6">
                "Karthik conducted a mock HR interview and restructured my resume for ATS filters. I feel so much more confident heading into campus placement season."
              </p>
              <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                <div className="w-9 h-9 rounded-full bg-[#A78BFA] text-[#202033] font-bold flex items-center justify-center text-xs">
                  A
                </div>
                <div>
                  <p className="text-xs font-bold text-[#202033]">Ananya Sharma</p>
                  <p className="text-[10px] text-[#77758A]">AI &amp; Data Science · Osmania Univ</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto bg-[#202033] text-white py-12 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#7546D8] flex items-center justify-center text-white font-bold">
                  PL
                </div>
                <span className="font-bold text-base tracking-tight">PeerLearn</span>
              </div>
              <p className="text-xs text-gray-400 leading-relaxed">
                Learn Together. Grow Together. Student skill exchange platform for peer-driven academic and career excellence.
              </p>
            </div>

            <div>
              <p className="text-xs font-bold text-white uppercase tracking-wider mb-3">Core Modules</p>
              <ul className="space-y-2 text-xs text-gray-400">
                <li>Smart Skill Matching</li>
                <li>Exchange Requests</li>
                <li>Learning Sessions</li>
                <li>Campus Activity &amp; Reviews</li>
              </ul>
            </div>

            <div>
              <p className="text-xs font-bold text-white uppercase tracking-wider mb-3">Academic DevOps</p>
              <ul className="space-y-2 text-xs text-gray-400">
                <li>Java 21 &amp; Spring Boot 3.3</li>
                <li>Spring Data JPA &amp; MySQL</li>
                <li>Spring Security Role Auth</li>
                <li>Thymeleaf Templates</li>
              </ul>
            </div>

            <div>
              <p className="text-xs font-bold text-white uppercase tracking-wider mb-3">Portals</p>
              <div className="space-y-2">
                <button
                  onClick={() => onOpenAuth('LOGIN')}
                  className="block text-xs text-gray-400 hover:text-white transition-colors cursor-pointer"
                >
                  Student Login
                </button>
                <button
                  onClick={() => onOpenAuth('REGISTER')}
                  className="block text-xs text-gray-400 hover:text-white transition-colors cursor-pointer"
                >
                  Student Registration
                </button>
                <button
                  onClick={onOpenDevOps}
                  className="block text-xs text-[#E9DDFC] hover:underline cursor-pointer"
                >
                  Download Maven Project ZIP
                </button>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-4">
            <p>&copy; 2026 PeerLearn Platform. Built for Student Skill Exchange &amp; Academic Case Studies.</p>
            <p>Windows 11 Compatible · Java 21 · Maven</p>
          </div>
        </div>
      </footer>
    </div>
  );
};
