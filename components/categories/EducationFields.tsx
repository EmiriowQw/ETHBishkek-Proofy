import React from 'react';

interface EducationFieldsProps {
  data: {
    institution?: string;
    degree?: string;
    graduationDate?: string;
    gpa?: string;
  };
  onChange: (data: any) => void;
}

export default function EducationFields({ data, onChange }: EducationFieldsProps) {
  const handleChange = (field: string, value: string) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Institution / University *
        </label>
        <input
          type="text"
          value={data.institution || ''}
          onChange={(e) => handleChange('institution', e.target.value)}
          placeholder="e.g., Harvard University"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Degree / Certificate *
        </label>
        <input
          type="text"
          value={data.degree || ''}
          onChange={(e) => handleChange('degree', e.target.value)}
          placeholder="e.g., Bachelor of Computer Science"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Graduation Date *
        </label>
        <input
          type="date"
          value={data.graduationDate || ''}
          onChange={(e) => handleChange('graduationDate', e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          GPA / Grade (Optional)
        </label>
        <input
          type="text"
          value={data.gpa || ''}
          onChange={(e) => handleChange('gpa', e.target.value)}
          placeholder="e.g., 3.8/4.0 or A"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
    </div>
  );
}

