import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

interface Category {
  id: string;
  name: string;
  icon: string;
  description: string;
  color: string;
  fields: string[];
  isCustom?: boolean;
}

interface CategorySelectorProps {
  onSelect: (category: Category) => void;
  selected: Category | null;
}

const CATEGORY_COLORS: Record<string, string> = {
  education: 'from-blue-500 to-indigo-600',
  sports: 'from-orange-500 to-red-600',
  volunteering: 'from-green-500 to-emerald-600',
  skills: 'from-purple-500 to-indigo-600',
  gray: 'from-gray-500 to-slate-600',
};

export default function CategorySelector({ onSelect, selected }: CategorySelectorProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customIcon, setCustomIcon] = useState('📌');
  const [customDescription, setCustomDescription] = useState('');
  const [customFields, setCustomFields] = useState<string[]>(['']);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      if (response.ok) {
        const data = await response.json();
        setCategories(data.categories || []);
      }
    } catch (error) {
      console.error('Error loading categories:', error);
      toast.error('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCustom = () => {
    if (customFields.filter(f => f.trim()).length === 0) {
      toast.error('Add at least one field');
      return;
    }
    if (!customName.trim()) {
      toast.error('Category name is required');
      return;
    }
    setShowCustomModal(true);
  };

  const addCustomField = () => {
    setCustomFields([...customFields, '']);
  };

  const removeCustomField = (index: number) => {
    setCustomFields(customFields.filter((_, i) => i !== index));
  };

  const updateCustomField = (index: number, value: string) => {
    const updated = [...customFields];
    updated[index] = value;
    setCustomFields(updated);
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="card animate-pulse h-40"></div>
        ))}
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {categories.map((category) => {
          const isSelected = selected?.id === category.id;
          const gradient = CATEGORY_COLORS[category.color] || CATEGORY_COLORS.gray;
          
          return (
            <button
              key={category.id}
              onClick={() => onSelect(category)}
              className={`card hover:shadow-xl transition-all duration-200 text-left ${
                isSelected ? 'ring-4 ring-primary-500 ring-offset-2' : ''
              }`}
            >
              <div className={`bg-gradient-to-br ${gradient} p-4 rounded-t-lg text-white -m-6 mb-4`}>
                <div className="text-4xl mb-2">{category.icon}</div>
                <h3 className="text-lg font-bold">{category.name}</h3>
              </div>
              <p className="text-sm text-gray-600">{category.description}</p>
              {category.isCustom && (
                <span className="inline-block mt-2 text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                  Custom
                </span>
              )}
            </button>
          );
        })}

        {/* Create Custom Category Button */}
        <button
          onClick={() => setShowCustomModal(true)}
          className="card hover:shadow-xl transition-all duration-200 text-center border-2 border-dashed border-gray-300 hover:border-primary-500"
        >
          <div className="flex flex-col items-center justify-center h-full text-gray-500 hover:text-primary-600">
            <div className="text-4xl mb-2">➕</div>
            <h3 className="text-lg font-bold">Create Custom</h3>
            <p className="text-sm">Add your own category</p>
          </div>
        </button>
      </div>

      {/* Custom Category Modal */}
      {showCustomModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Create Custom Category</h3>
                  <p className="text-gray-600">Define your own achievement category</p>
                </div>
                <button
                  onClick={() => setShowCustomModal(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category Name *
                  </label>
                  <input
                    type="text"
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    placeholder="e.g., Art Competitions, Music Awards"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Icon (Emoji)
                  </label>
                  <input
                    type="text"
                    value={customIcon}
                    onChange={(e) => setCustomIcon(e.target.value)}
                    placeholder="📌"
                    maxLength={2}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={customDescription}
                    onChange={(e) => setCustomDescription(e.target.value)}
                    placeholder="Brief description of this category..."
                    rows={2}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Custom Fields *
                  </label>
                  {customFields.map((field, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={field}
                        onChange={(e) => updateCustomField(index, e.target.value)}
                        placeholder="e.g., eventName, artworkTitle"
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                      />
                      {customFields.length > 1 && (
                        <button
                          onClick={() => removeCustomField(index)}
                          className="px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    onClick={addCustomField}
                    className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                  >
                    + Add Field
                  </button>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowCustomModal(false)}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-4 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateCustom}
                  disabled={!customName.trim() || customFields.filter(f => f.trim()).length === 0}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold py-3 px-4 rounded-lg disabled:opacity-50"
                >
                  Create Category
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

