import React from 'react';

interface CustomFieldsProps {
  fields: string[];
  data: Record<string, string>;
  onChange: (data: Record<string, string>) => void;
}

export default function CustomFields({ fields, data, onChange }: CustomFieldsProps) {
  const handleChange = (field: string, value: string) => {
    onChange({ ...data, [field]: value });
  };

  if (!fields || fields.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No custom fields defined for this category.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {fields.map((field, index) => (
        <div key={index}>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {field.split(/(?=[A-Z])/).join(' ')} *
          </label>
          <input
            type="text"
            value={data[field] || ''}
            onChange={(e) => handleChange(field, e.target.value)}
            placeholder={`Enter ${field.split(/(?=[A-Z])/).join(' ').toLowerCase()}...`}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
            required
          />
        </div>
      ))}
    </div>
  );
}

