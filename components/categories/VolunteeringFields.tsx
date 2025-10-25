import React from 'react';

interface VolunteeringFieldsProps {
  data: {
    organization?: string;
    hours?: string;
    activityType?: string;
    startDate?: string;
    endDate?: string;
  };
  onChange: (data: any) => void;
}

const ACTIVITY_TYPES = [
  'Community Service',
  'Environmental',
  'Education & Tutoring',
  'Healthcare',
  'Animal Welfare',
  'Disaster Relief',
  'Food Bank',
  'Elderly Care',
  'Youth Programs',
  'Other'
];

export default function VolunteeringFields({ data, onChange }: VolunteeringFieldsProps) {
  const handleChange = (field: string, value: string) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Organization *
        </label>
        <input
          type="text"
          value={data.organization || ''}
          onChange={(e) => handleChange('organization', e.target.value)}
          placeholder="e.g., Red Cross, Local NGO"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Activity Type *
        </label>
        <select
          value={data.activityType || ''}
          onChange={(e) => handleChange('activityType', e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          required
        >
          <option value="">Select activity type...</option>
          {ACTIVITY_TYPES.map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Hours Contributed *
        </label>
        <input
          type="number"
          value={data.hours || ''}
          onChange={(e) => handleChange('hours', e.target.value)}
          placeholder="e.g., 40"
          min="1"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Start Date *
          </label>
          <input
            type="date"
            value={data.startDate || ''}
            onChange={(e) => handleChange('startDate', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            End Date *
          </label>
          <input
            type="date"
            value={data.endDate || ''}
            onChange={(e) => handleChange('endDate', e.target.value)}
            min={data.startDate}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            required
          />
        </div>
      </div>
    </div>
  );
}

