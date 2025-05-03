'use client';

import { MessageSquare, Plus, X } from 'lucide-react';
import { Conversation } from '../hooks/useConversations';
import { formatDate } from '../utils/formatters';

interface ConversationListProps {
  conversations: Conversation[];
  currentConversationId: string | null;
  onSelectConversation: (id: string) => void;
  onDeleteConversation: (id: string) => void;
  onCreateNewConversation: () => void;
}

export default function ConversationList({
  conversations,
  currentConversationId,
  onSelectConversation,
  onDeleteConversation,
  onCreateNewConversation
}: ConversationListProps) {
  return (
    <>
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={onCreateNewConversation}
          className="w-full flex items-center justify-center gap-2 p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors duration-200"
        >
          <Plus className="w-5 h-5" />
          New Chat
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {conversations.map((conversation) => (
          <div
            key={conversation.id}
            className={`group flex items-center gap-3 p-4 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 ${
              currentConversationId === conversation.id ? 'bg-gray-100 dark:bg-gray-700' : ''
            }`}
            onClick={() => onSelectConversation(conversation.id)}
          >
            <MessageSquare className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-gray-900 dark:text-white truncate">
                {conversation.title || 'New Chat'}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                <span>{formatDate(conversation.lastUpdated)}</span>
                {conversation.messages.length > 0 && (
                  <>
                    <span>•</span>
                    <span>{conversation.messages.length} message{conversation.messages.length !== 1 ? 's' : ''}</span>
                  </>
                )}
              </div>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDeleteConversation(conversation.id);
              }}
              className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-all duration-200"
              aria-label="Delete conversation"
            >
              <X className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            </button>
          </div>
        ))}
      </div>
    </>
  );
} 