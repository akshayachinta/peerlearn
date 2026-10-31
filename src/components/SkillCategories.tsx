import React, { useState } from 'react';
import {
  Grid,
  Code2,
  Brain,
  Rocket,
  Award,
  Sparkles,
  Users,
  Search,
  ArrowRight,
  ChevronRight,
  BookOpen
} from 'lucide-react';
import { SkillCategoryName } from '../types';
import { storage } from '../services/storage';

interface SkillCategoriesProps {
  onSelectCategory: (category: SkillCategoryName) => void;
}

export const SkillCategories: React.FC<SkillCategoriesProps> = ({ onSelectCategory }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const students = storage.getStudents();
  const allSkills = storage.getAllSkills();

  const categoriesData: {
    name: SkillCategoryName;
    icon: any;
    color: string;
    bgGradient: string;
    description: string;
  }[] = [
    {
      name: 'Programming',
      icon: Code2,
      color: '#7546D8',
      bgGradient: 'from-[#7546D8]/10 to-[#5425A8]/5',
      description: 'Core logic, data structures, backend engineering and software architecture.'
    },
    {
      name: 'Web Development',
      icon: Grid,
      color: '#5425A8',
      bgGradient: 'from-[#5425A8]/10 to-[#7546D8]/5',
      description: 'Modern frontend layouts, responsive UI frameworks, and web standards.'
    },
    {
      name: 'Data and AI',
      icon: Brain,
      color: '#16A36A',
      bgGradient: 'from-emerald-500/10 to-teal-500/5',
      description: 'Machine learning algorithms, data analytics, predictive models, and AI pipelines.'
    },
    {
      name: 'Career Skills',
      icon: Award,
      color: '#F5A623',
      bgGradient: 'from-amber-500/10 to-orange-500/5',
      description: 'Campus placement aptitude, technical interview drills, and ATS-optimized resume building.'
    },
    {
      name: 'Communication',
      icon: Users,
      color: '#E05252',
      bgGradient: 'from-rose-500/10 to-red-500/5',
      description: 'Public speaking confidence, presentation polish, and articulate technical storytelling.'
    },
    {
      name: 'Creative',
      icon: Sparkles,
      color: '#A78BFA',
      bgGradient: 'from-purple-500/10 to-indigo-500/5',
      description: 'UI/UX wireframing in Figma, visual design, slide deck graphics, and multimedia editing.'
    },
    {
      name: 'Cloud and DevOps',
      icon: Rocket,
      color: '#2563EB',
      bgGradient: 'from-blue-500/10 to-indigo-500/5',
      description: 'AWS infrastructure, Docker containers, Kubernetes orchestration, Git version control.'
    }
  ];

  const filteredCategories = categoriesData.filter(c => {
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const matchName = c.name.toLowerCase().includes(q);
      const matchDesc = c.description.toLowerCase().includes(q);
      const matchSkill = allSkills.some(
        s => s.category === c.name && s.name.toLowerCase().includes(q)
      );
      return matchName || matchDesc || matchSkill;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Grid className="w-5 h-5 text-[#7546D8]" />
            <h1 className="text-xl font-extrabold text-[#202033]">Skill Categories</h1>
          </div>
          <p className="text-xs text-[#77758A]">
            Explore 7 distinct categories spanning engineering, intelligence, design, and career growth.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search categories or skills..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:border-[#7546D8]"
          />
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCategories.map(cat => {
          const Icon = cat.icon;
          const skillsInCat = allSkills.filter(s => s.category === cat.name);

          // Calculate mentors and learners in this category across students
          let mentorCount = 0;
          let learnerCount = 0;

          students.forEach(s => {
            const teaches = s.skills.some(sk => sk.category === cat.name && sk.type === 'TEACH');
            const learns = s.skills.some(sk => sk.category === cat.name && sk.type === 'LEARN');
            if (teaches) mentorCount++;
            if (learns) learnerCount++;
          });

          return (
            <div
              key={cat.name}
              className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs hover:shadow-lg hover:border-[#E9DDFC] transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform"
                    style={{ backgroundColor: cat.color }}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-[#202033] font-mono">{mentorCount} Mentors</p>
                    <p className="text-[10px] text-[#77758A]">{learnerCount} Learners</p>
                  </div>
                </div>

                <h3 className="text-base font-bold text-[#202033] group-hover:text-[#7546D8] transition-colors">
                  {cat.name}
                </h3>
                <p className="text-xs text-[#77758A] mt-1 leading-relaxed">
                  {cat.description}
                </p>

                {/* Popular Skills Chips */}
                <div className="mt-4 pt-3 border-t border-gray-100">
                  <span className="text-[10px] font-bold text-[#77758A] uppercase tracking-wider block mb-2">
                    Included Skills:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {skillsInCat.map(s => (
                      <span
                        key={s.id}
                        className="text-[11px] px-2.5 py-1 bg-[#F8F7FC] text-[#5425A8] rounded-lg font-medium border border-gray-100"
                      >
                        {s.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => onSelectCategory(cat.name)}
                className="w-full mt-6 py-2.5 bg-[#FAF9FD] hover:bg-[#7546D8] text-[#5425A8] hover:text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer border border-[#E9DDFC] hover:border-transparent"
              >
                <span>Explore Students in {cat.name}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
