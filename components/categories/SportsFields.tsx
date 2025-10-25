import React from 'react';

interface SportsFieldsProps {
  data: {
    sportType?: string;
    eventName?: string;
    placement?: string;
    date?: string;
    organizer?: string;
  };
  onChange: (data: any) => void;
}

const SPORT_TYPES = [
  'Football', 'Basketball', 'Running', 'Swimming', 'Tennis', 
  'Volleyball', 'Boxing', 'Martial Arts', 'Cycling', 'Gym/Fitness',
  'Other'
];

const PLACEMENTS = [
  '1st Place 🥇', 
  '2nd Place 🥈', 
  '3rd Place 🥉',
  'Top 10',
  'Participant',
  'Team Win',
  'Personal Record'
];

export default function SportsFields({ data, onChange }: SportsFieldsProps) {
  const handleChange = (field: string, value: string) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Sport Type *
        </label>
        <select
          value={data.sportType || ''}
          onChange={(e) => handleChange('sportType', e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          required
        >
          <option value="">Select sport...</option>
          {SPORT_TYPES.map(sport => (
            <option key={sport} value={sport}>{sport}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Event / Competition Name *
        </label>
        <input
          type="text"
          value={data.eventName || ''}
          onChange={(e) => handleChange('eventName', e.target.value)}
          placeholder="e.g., City Marathon 2025"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Placement / Achievement *
        </label>
        <select
          value={data.placement || ''}
          onChange={(e) => handleChange('placement', e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          required
        >
          <option value="">Select placement...</option>
          {PLACEMENTS.map(placement => (
            <option key={placement} value={placement}>{placement}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Event Date *
        </label>
        <input
          type="date"
          value={data.date || ''}
          onChange={(e) => handleChange('date', e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Organizer *
        </label>
        <input
          type="text"
          value={data.organizer || ''}
          onChange={(e) => handleChange('organizer', e.target.value)}
          placeholder="e.g., National Sports Federation"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          required
        />
      </div>
    </div>
  );
}

