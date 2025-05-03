'use client';

import { useState, useRef, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Message } from '../types/api';

// Components
import Header from './Header';
import SettingsPanel from './SettingsPanel';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import ConversationList from './ConversationList';
import FileUploader from './FileUploader';
import MetaInformation from './MetaInformation';
import MetaInformationModal from './MetaInformationModal';

// Hooks
import { useConversations } from '../hooks/useConversations';
import { useFileUpload, DocumentCategory } from '../hooks/useFileUpload';
import { useTheme } from '../hooks/useTheme';
import { useChatApi } from '../hooks/useChatApi';

// Utils
import { exportChatAsJson } from '../utils/exportUtils';

const MODELS = [
  { id: 'gpt-4o-mini', name: 'GPT-4o Mini' },
  { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo' },
  { id: 'gpt-4.1', name: 'gpt-4.1-mini-2025-04-14' },
];

export default function Chat() {
  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // UI state
  const [showSettings, setShowSettings] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const [showUploadArea, setShowUploadArea] = useState(false);
  const [selectedModel, setSelectedModel] = useState(MODELS[2].id);
  const [temperature, setTemperature] = useState(0.2);
  const [topK, setTopK] = useState(5);

  // New state for meta information editing
  const [isEditingMetaInfo, setIsEditingMetaInfo] = useState(false);
  const [showMetaInfoModal, setShowMetaInfoModal] = useState(false);

  // Custom hooks
  const { isDarkMode, toggleDarkMode } = useTheme();
  const { conversations, currentConversationId, currentConversation, setCurrentConversationId, createNewConversation, deleteConversation, addMessageToConversation, clearCurrentConversation, updateConversationMetaInformation, updateConversationTitle } = useConversations();
  const { uploadedFiles, isUploading, uploadFiles, deleteFile, deleteFileFromKnowledgeBase, updateFileCategory, categories } = useFileUpload();
  const { sendMessage, isLoading } = useChatApi();

  // Ensure there's always a conversation selected (but not creating duplicates)
  useEffect(() => {
    if (conversations.length > 0 && !currentConversationId) {
      setCurrentConversationId(conversations[0].id);
    }
  }, [conversations, currentConversationId, setCurrentConversationId]);

  // Scroll to bottom when messages change
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Event handlers
  const handleCopyMessage = (content: string) => {
    navigator.clipboard.writeText(content);
  };

  const handleExportChat = () => {
    if (currentConversation?.messages) {
      exportChatAsJson(currentConversation.messages);
    }
  };

  // Add this new function for handling meta information updates
  const handleUpdateMetaInfo = (metaInfo: string) => {
    if (currentConversationId) {
      updateConversationMetaInformation(currentConversationId, metaInfo);
    }
  };

  // Add handleUpdateTitle function
  const handleUpdateTitle = (newTitle: string) => {
    if (currentConversationId) {
      updateConversationTitle(currentConversationId, newTitle);
    }
  };

  const handleNewChat = () => {
    // Check if there's already an empty conversation we can use
    const emptyConversation = conversations.find(
      conv => conv.messages.length === 0 && conv.title === 'New Chat'
    );
    
    if (emptyConversation) {
      setCurrentConversationId(emptyConversation.id);
    } else {
      createNewConversation();
    }
  };

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;
    
    // If no conversation exists, create one
    let activeConversationId = currentConversationId;
    if (!activeConversationId) {
      activeConversationId = createNewConversation();
    }

    // Create and add user message
    const userMessage: Message = {
      id: uuidv4(),
      role: 'user',
      content,
      timestamp: new Date(),
    };
    
    addMessageToConversation(activeConversationId, userMessage);

    // Send to API and handle response
    await sendMessage(
      content, 
      currentConversation?.messages, // Pass the current conversation messages as history
      {
        model: selectedModel,
        temperature,
        topK: topK,
        metaInformation: currentConversation?.metaInformation,
        onSuccess: (assistantMessage) => {
          addMessageToConversation(activeConversationId!, assistantMessage);
          scrollToBottom();
        },
        onError: (errorMessage) => {
          addMessageToConversation(activeConversationId!, errorMessage);
          scrollToBottom();
        }
      }
    );
  };

  // Handle file category update
  const handleUpdateCategory = (fileId: string, category: DocumentCategory) => {
    updateFileCategory(fileId, category);
  };

  return (
    <div className={`flex h-screen ${isDarkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      {/* Sidebar */}
      <div className={`${showSidebar ? 'w-80' : 'w-0'} transition-all duration-300 flex flex-col border-r border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800`}>
        {/* Conversation List */}
        <ConversationList
          conversations={conversations}
          currentConversationId={currentConversationId}
          onSelectConversation={setCurrentConversationId}
          onDeleteConversation={deleteConversation}
          onCreateNewConversation={handleNewChat}
        />

        {/* File Uploader */}
        <FileUploader
          isUploading={isUploading}
          uploadedFiles={uploadedFiles}
          onUpload={uploadFiles}
          onDelete={deleteFile}
          onDeleteFromKnowledgeBase={deleteFileFromKnowledgeBase}
          onUpdateCategory={handleUpdateCategory}
          isExpanded={showUploadArea}
          onToggle={() => setShowUploadArea(!showUploadArea)}
          categories={categories}
        />
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <Header
          onToggleSettings={() => setShowSettings(!showSettings)}
          onClearChat={clearCurrentConversation}
          onExportChat={handleExportChat}
          onEditMetaInfo={() => {
            // If no messages, edit inline, otherwise show modal
            if (currentConversation?.messages.length === 0) {
              setIsEditingMetaInfo(true);
            } else {
              setShowMetaInfoModal(true);
            }
          }}
          isDarkMode={isDarkMode}
          onToggleDarkMode={toggleDarkMode}
          title={currentConversation?.title || 'New Chat'}
          onUpdateTitle={handleUpdateTitle}
        />

        {/* Settings Panel */}
        {showSettings && (
          <SettingsPanel
            selectedModel={selectedModel}
            onModelChange={setSelectedModel}
            temperature={temperature}
            onTemperatureChange={setTemperature}
            models={MODELS}
            topK={topK}
            onTopKChange={setTopK}
          />
        )}

        {/* Meta Information Modal for existing chats */}
        <MetaInformationModal
          isOpen={showMetaInfoModal}
          onClose={() => setShowMetaInfoModal(false)}
          value={currentConversation?.metaInformation || ''}
          onSave={handleUpdateMetaInfo}
        />

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6 dark:bg-gray-900 scroll-smooth">
          {/* Meta Information (only show if there are no messages or if editing) */}
          {(currentConversation?.messages.length === 0 || isEditingMetaInfo) && currentConversationId && (
            <MetaInformation 
              value={currentConversation?.metaInformation || ''} 
              onSave={handleUpdateMetaInfo}
              isEditing={isEditingMetaInfo}
              onToggleEdit={() => setIsEditingMetaInfo(!isEditingMetaInfo)}
            />
          )}
          
          {currentConversation?.messages.map((message) => (
            <ChatMessage
              key={message.id}
              message={message}
              onCopy={handleCopyMessage}
            />
          ))}
          
          {/* Loading indicator */}
          {isLoading && (
            <div className="flex justify-start animate-fadeIn">
              <div className="bg-white dark:bg-gray-800 shadow-md rounded-2xl p-4 max-w-[80%]">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-blue-500/60 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-blue-500/60 rounded-full animate-bounce delay-150" />
                  <div className="w-2 h-2 bg-blue-500/60 rounded-full animate-bounce delay-300" />
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Chat Input */}
        <ChatInput
          onSendMessage={handleSendMessage}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
} 