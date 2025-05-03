'use client';

import { useState, useEffect } from 'react';
import { Edit, Save, X } from 'lucide-react';

interface MetaInformationProps {
  value: string;
  onSave: (value: string) => void;
  isEditing: boolean;
  onToggleEdit: () => void;
}

export default function MetaInformation({ value, onSave, isEditing, onToggleEdit }: MetaInformationProps) {
  const [inputValue, setInputValue] = useState(value || '');

  useEffect(() => {
    setInputValue(value || '');
  }, [value]);

  const handleSave = () => {
    onSave(inputValue);
    onToggleEdit();
  };

  const handleCancel = () => {
    setInputValue(value || '');
    onToggleEdit();
  };

  if (!isEditing) {
    return (
      <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 relative group">
        <button 
          onClick={onToggleEdit}
          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400"
          aria-label="Edit meta information"
        >
          <Edit className="w-4 h-4" />
        </button>
        
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Chat Context
        </h3>
        
        {value ? (
          <p className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
            {value}
          </p>
        ) : (
          <p className="text-sm text-gray-400 dark:text-gray-500 italic">
            Add context information for this chat (will be included in the system prompt)
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Chat Context
        </h3>
        <div className="flex items-center gap-1">
          <button
            onClick={handleCancel}
            className="p-1.5 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400"
            aria-label="Cancel editing"
          >
            <X className="w-4 h-4" />
          </button>
          <button
            onClick={handleSave}
            className="p-1.5 rounded-md hover:bg-blue-100 dark:hover:bg-blue-900/30 text-blue-600 dark:text-blue-400"
            aria-label="Save meta information"
          >
            <Save className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      <textarea
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Add context information for this chat (will be included in the system prompt)"
        className="w-full p-2 text-sm bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
        rows={3}
        autoFocus
      />
      
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
        This information will be included in every system prompt for this chat.
      </p>
    </div>
  );
} 