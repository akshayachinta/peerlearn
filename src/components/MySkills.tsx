
import React, { useState } from 'react';
import {
  Award,
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  BookOpen,
  AlertCircle
} from 'lucide-react';
import { Student, ProficiencyLevel, SkillCategoryName } from '../types';
import { api } from '../services/api';
import { INITIAL_SKILLS } from '../data/initialData';

interface MySkillsProps {
  currentStudent: Student | null;
  onStudentUpdated: () => void;
}

export const MySkills: React.FC<MySkillsProps> = ({
  currentStudent,
  onStudentUpdated,
}) => {
  const [activeTab, setActiveTab] = useState<'TEACH' | 'LEARN'>('TEACH');
  const [showAddModal, setShowAddModal] = useState(false);

  // Add Skill Form state
  const [category, setCategory] = useState<SkillCategoryName>('Programming');
  const [skillName, setSkillName] = useState('Python');
  const [customSkill, setCustomSkill] = useState('');
  const [proficiency, setProficiency] = useState<ProficiencyLevel>('Intermediate');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Edit inline proficiency state
  const [editingSkillId, setEditingSkillId] = useState<string | null>(null);
  const [editProficiency, setEditProficiency] = useState<ProficiencyLevel>('Intermediate');

  if (!currentStudent) return null;

  const teachSkills = currentStudent.skills.filter(s => s.type === 'TEACH');
  const learnSkills = currentStudent.skills.filter(s => s.type === 'LEARN');

  const categorySkills = INITIAL_SKILLS.filter(s => s.category === category);

  // Add Skill to Spring Boot + MySQL
  const handleAddSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const finalSkillName = customSkill.trim() || skillName;

    if (!finalSkillName.trim()) {
      setError('Please select or specify a skill name.');
      return;
    }

    try {
      setIsSaving(true);

      await api.addStudentSkill(currentStudent.id, {
        skillName: finalSkillName,
        category,
        proficiency,
        type: activeTab,
        experienceOrGoal:
          notes.trim() ||
          (activeTab === 'TEACH'
            ? 'Hands-on practice & project work'
            : 'Target goal for campus placement & projects')
      });

      setShowAddModal(false);
      setCustomSkill('');
      setNotes('');
      setSkillName('Python');

      onStudentUpdated();
    } catch (err: any) {
      setError(err.message || 'Could not add skill.');
    } finally {
      setIsSaving(false);
    }
  };

  // Delete Skill from Spring Boot + MySQL
  const handleDeleteSkill = async (skillId: string) => {
    const confirmed = window.confirm('Are you sure you want to delete this skill?');

    if (!confirmed) return;

    try {
      await api.deleteStudentSkill(currentStudent.id, skillId);
      onStudentUpdated();
    } catch (err: any) {
      alert(err.message || 'Could not delete skill.');
    }
  };

  // Update proficiency in Spring Boot + MySQL
  const handleSaveProficiency = async (skillId: string) => {
    try {
      await api.updateSkillProficiency(
        currentStudent.id,
        skillId,
        editProficiency
      );

      setEditingSkillId(null);
      onStudentUpdated();
    } catch (err: any) {
      alert(err.message || 'Could not update proficiency.');
    }
  };

  const currentList = activeTab === 'TEACH' ? teachSkills : learnSkills;

  return (
    <div className="space-y-6">

      {/* Top Banner */}
      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Award className="w-5 h-5 text-[#7546D8]" />
            <h1 className="text-xl font-extrabold text-[#202033]">
              My Skills Portfolio
            </h1>
          </div>

          <p className="text-xs text-[#77758A]">
            Define the skills you are ready to teach others and the skills you want to learn. The matching engine relies on this!
          </p>
        </div>

        <button
          onClick={() => {
            setError(null);
            setShowAddModal(true);
          }}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#7546D8] hover:bg-[#5425A8] text-white text-xs font-bold rounded-xl shadow-md transition-all self-start md:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>
            Add Skill ({activeTab === 'TEACH' ? 'To Teach' : 'To Learn'})
          </span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 p-1.5 bg-white rounded-2xl border border-gray-100 shadow-xs max-w-md">
        <button
          onClick={() => setActiveTab('TEACH')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 ${
            activeTab === 'TEACH'
              ? 'bg-[#16A36A] text-white shadow-sm'
              : 'text-[#77758A] hover:text-[#202033]'
          }`}
        >
          <span>Skills I Can Teach</span>

          <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
            activeTab === 'TEACH'
              ? 'bg-white/20 text-white'
              : 'bg-gray-100 text-gray-700'
          }`}>
            {teachSkills.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('LEARN')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 ${
            activeTab === 'LEARN'
              ? 'bg-[#7546D8] text-white shadow-sm'
              : 'text-[#77758A] hover:text-[#202033]'
          }`}
        >
          <span>Skills I Want to Learn</span>

          <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
            activeTab === 'LEARN'
              ? 'bg-white/20 text-white'
              : 'bg-gray-100 text-gray-700'
          }`}>
            {learnSkills.length}
          </span>
        </button>
      </div>

      {/* Skills List Cards */}
      {currentList.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 space-y-3">
          <BookOpen className="w-10 h-10 text-gray-300 mx-auto" />

          <h3 className="text-sm font-bold text-[#202033]">
            No skills configured for {activeTab === 'TEACH' ? 'teaching' : 'learning'} yet
          </h3>

          <p className="text-xs text-[#77758A] max-w-md mx-auto">
            Click "Add Skill" above to choose from Programming, AI, Cloud, Design, Communication or Career skills.
          </p>

          <button
            onClick={() => {
              setError(null);
              setShowAddModal(true);
            }}
            className="mt-2 px-4 py-2 bg-[#7546D8] text-white rounded-xl text-xs font-bold shadow cursor-pointer"
          >
            Add Your First Skill
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {currentList.map(skill => {
            const isEditing = editingSkillId === skill.id;

            return (
              <div
                key={skill.id}
                className="bg-white rounded-2xl p-5 border border-gray-100 shadow-xs hover:border-[#E9DDFC] transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <span className="text-[10px] font-bold text-[#77758A] uppercase tracking-wider block">
                        {skill.category}
                      </span>

                      <h3 className="text-base font-bold text-[#202033] mt-0.5">
                        {skill.skillName}
                      </h3>
                    </div>

                    {isEditing ? (
                      <div className="flex items-center gap-1">
                        <select
                          value={editProficiency}
                          onChange={e =>
                            setEditProficiency(e.target.value as ProficiencyLevel)
                          }
                          className="text-[11px] p-1 border border-gray-200 rounded bg-white"
                        >
                          <option value="Beginner">Beginner</option>
                          <option value="Intermediate">Intermediate</option>
                          <option value="Advanced">Advanced</option>
                        </select>

                        <button
                          onClick={() => handleSaveProficiency(skill.id)}
                          className="p-1 text-green-600 hover:bg-green-50 rounded cursor-pointer"
                          title="Save proficiency"
                        >
                          <Check className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => setEditingSkillId(null)}
                          className="p-1 text-gray-400 hover:bg-gray-100 rounded cursor-pointer"
                          title="Cancel editing"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                          skill.proficiency === 'Advanced'
                            ? 'bg-green-100 text-[#16A36A]'
                            : skill.proficiency === 'Intermediate'
                            ? 'bg-[#E9DDFC] text-[#5425A8]'
                            : 'bg-amber-100 text-[#F5A623]'
                        }`}
                      >
                        {skill.proficiency}
                      </span>
                    )}
                  </div>

                  {skill.yearsExperienceOrGoal && (
                    <p className="text-xs text-[#77758A] leading-relaxed mt-2 bg-[#F8F7FC] p-2.5 rounded-xl border border-gray-100">
                      {skill.yearsExperienceOrGoal}
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 mt-3 border-t border-gray-100 text-xs">
                  {!isEditing && (
                    <button
                      onClick={() => {
                        setEditingSkillId(skill.id);
                        setEditProficiency(skill.proficiency);
                      }}
                      className="p-1.5 text-gray-400 hover:text-[#7546D8] hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                      title="Edit proficiency"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                  )}

                  <button
                    onClick={() => handleDeleteSkill(skill.id)}
                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                    title="Delete skill"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Skill Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-[#E9DDFC]">

            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-[#F8F7FC]">
              <div className="flex items-center gap-2.5">
                <div className={`w-8 h-8 rounded-xl text-white flex items-center justify-center ${
                  activeTab === 'TEACH' ? 'bg-[#16A36A]' : 'bg-[#7546D8]'
                }`}>
                  <Plus className="w-4 h-4" />
                </div>

                <div>
                  <h3 className="text-sm font-bold text-[#202033]">
                    Add Skill {activeTab === 'TEACH' ? 'To Teach' : 'To Learn'}
                  </h3>

                  <p className="text-[11px] text-[#77758A]">
                    Expand your peer exchange portfolio
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSkill} className="p-6 space-y-4">

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Category */}
              <div>
                <label className="block text-xs font-semibold text-[#202033] mb-1">
                  Skill Category
                </label>

                <select
                  value={category}
                  onChange={e => {
                    const cat = e.target.value as SkillCategoryName;
                    setCategory(cat);

                    const defaultInCat = INITIAL_SKILLS.find(
                      s => s.category === cat
                    );

                    if (defaultInCat) {
                      setSkillName(defaultInCat.name);
                    }
                  }}
                  className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:border-[#7546D8] bg-white"
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

              {/* Predefined Skill Picker */}
              <div>
                <label className="block text-xs font-semibold text-[#202033] mb-1">
                  Select Skill
                </label>

                <select
                  value={skillName}
                  onChange={e => setSkillName(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:border-[#7546D8] bg-white"
                >
                  {categorySkills.map(s => (
                    <option key={s.id} value={s.name}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Custom Skill */}
              <div>
                <label className="block text-xs font-semibold text-[#202033] mb-1">
                  Or Custom Skill Name (Optional)
                </label>

                <input
                  type="text"
                  placeholder="e.g. Next.js, FastAPI, Tableau, Public Speaking"
                  value={customSkill}
                  onChange={e => setCustomSkill(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:border-[#7546D8]"
                />
              </div>

              {/* Proficiency */}
              <div>
                <label className="block text-xs font-semibold text-[#202033] mb-1">
                  Proficiency Level
                </label>

                <div className="grid grid-cols-3 gap-2">
                  {(['Beginner', 'Intermediate', 'Advanced'] as const).map(p => (
                    <button
                      type="button"
                      key={p}
                      onClick={() => setProficiency(p)}
                      className={`py-2 text-xs font-semibold rounded-xl border transition-all cursor-pointer ${
                        proficiency === p
                          ? 'border-[#7546D8] bg-[#E9DDFC] text-[#5425A8]'
                          : 'border-gray-200 text-[#77758A] hover:bg-gray-50'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              {/* Experience or Learning Goal */}
              <div>
                <label className="block text-xs font-semibold text-[#202033] mb-1">
                  {activeTab === 'TEACH'
                    ? 'Experience / Teaching Note'
                    : 'Learning Target / Goal'}
                </label>

                <textarea
                  rows={2}
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder={
                    activeTab === 'TEACH'
                      ? 'e.g. Built 3 full-stack apps with Flask & Pandas'
                      : 'e.g. Want to learn Spring Data JPA for backend internships'
                  }
                  className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:border-[#7546D8]"
                />
              </div>

              {/* Modal Buttons */}
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-[#77758A] hover:bg-gray-100 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2.5 bg-[#7546D8] hover:bg-[#5425A8] disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow cursor-pointer"
                >
                  {isSaving ? 'Saving...' : 'Add Skill'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
