'use client';

import { Settings, Trash, Download, Sun, Moon, FileText } from 'lucide-react';
import EditableChatTitle from './EditableChatTitle';

interface HeaderProps {
  onToggleSettings: () => void;
  onClearChat: () => void;
  onExportChat: () => void;
  onEditMetaInfo: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  title: string;
  onUpdateTitle: (newTitle: string) => void;
}

export default function Header({
  onToggleSettings,
  onClearChat,
  onExportChat,
  onEditMetaInfo,
  isDarkMode,
  onToggleDarkMode,
  title,
  onUpdateTitle
}: HeaderProps) {
  return (
    <header className="flex items-center p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
      <div className="flex items-center min-w-0 w-1/3">
        <EditableChatTitle title={title} onSave={onUpdateTitle} />
      </div>
      
      <div className="w-1/3 flex justify-center">
        <h1 className="text-2xl font-bold text-blue-600 dark:text-blue-400">aika</h1>
      </div>
      
      <div className="flex items-center space-x-1 justify-end w-1/3">
        <button
          onClick={onEditMetaInfo}
          className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
          aria-label="Edit context information"
        >
          <FileText className="w-5 h-5" />
        </button>
        
        <button
          onClick={onToggleSettings}
          className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
          aria-label="Settings"
        >
          <Settings className="w-5 h-5" />
        </button>
        
        <button
          onClick={onClearChat}
          className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
          aria-label="Clear chat"
        >
          <Trash className="w-5 h-5" />
        </button>
        
        <button
          onClick={onExportChat}
          className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
          aria-label="Export chat"
        >
          <Download className="w-5 h-5" />
        </button>
        
        <button
          onClick={onToggleDarkMode}
          className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
          aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
        >
          {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
      </div>
    </header>
  );
} 