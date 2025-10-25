import React from 'react';

interface SkillsFieldsProps {
  data: {
    skillName?: string;
    level?: string;
    projects?: string;
    yearsExperience?: string;
  };
  onChange: (data: any) => void;
}

const SKILL_LEVELS = [
  'Junior',
  'Middle',
  'Senior',
  'Expert/Lead'
];

export default function SkillsFields({ data, onChange }: SkillsFieldsProps) {
  const handleChange = (field: string, value: string) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Skill Name *
        </label>
        <input
          type="text"
          value={data.skillName || ''}
          onChange={(e) => handleChange('skillName', e.target.value)}
          placeholder="e.g., React Development, Project Management"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Proficiency Level *
        </label>
        <select
          value={data.level || ''}
          onChange={(e) => handleChange('level', e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          required
        >
          <option value="">Select level...</option>
          {SKILL_LEVELS.map(level => (
            <option key={level} value={level}>{level}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Years of Experience *
        </label>
        <input
          type="number"
          value={data.yearsExperience || ''}
          onChange={(e) => handleChange('yearsExperience', e.target.value)}
          placeholder="e.g., 3"
          min="0"
          step="0.5"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Supporting Projects / Evidence *
        </label>
        <textarea
          value={data.projects || ''}
          onChange={(e) => handleChange('projects', e.target.value)}
          placeholder="Describe projects where you applied this skill, link to portfolio, GitHub, or provide other evidence..."
          rows={5}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          required
        />
        <p className="text-xs text-gray-500 mt-1">
          Minimum 50 characters required
        </p>
      </div>
    </div>
  );
}

