'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface MetaInformationModalProps {
  isOpen: boolean;
  onClose: () => void;
  value: string;
  onSave: (value: string) => void;
}

export default function MetaInformationModal({ isOpen, onClose, value, onSave }: MetaInformationModalProps) {
  const [inputValue, setInputValue] = useState(value || '');

  useEffect(() => {
    setInputValue(value || '');
  }, [value, isOpen]);

  const handleSave = () => {
    onSave(inputValue);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-md w-full animate-fadeIn">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Chat Context
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-4">
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Add context information for this chat (will be included in the system prompt)"
            className="w-full p-3 text-gray-700 dark:text-white bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            rows={6}
            autoFocus
          />
          
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            This information will be included in every system prompt for this chat.
          </p>
        </div>
        
        <div className="flex justify-end space-x-2 p-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 rounded-md transition-colors"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
} 