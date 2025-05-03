import { useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Message } from '../types/api';

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  lastUpdated: Date;
  metaInformation?: string;
}

export function useConversations() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Create a new conversation function (extracted for reuse)
  const createNewConversation = useCallback(() => {
    // Only create if not already initialized or explicitly requested
    const newConversation: Conversation = {
      id: uuidv4(),
      title: 'New Chat',
      messages: [],
      lastUpdated: new Date(),
      metaInformation: ''
    };
    setConversations(prev => [newConversation, ...prev]);
    setCurrentConversationId(newConversation.id);
    return newConversation.id;
  }, []);

  // Load conversations from localStorage on initial render
  useEffect(() => {
    if (isInitialized) return; // Skip if already initialized
    
    const savedConversations = localStorage.getItem('conversations');
    if (savedConversations) {
      const parsed = JSON.parse(savedConversations);
      if (parsed.length > 0) {
        setConversations(parsed.map((conv: any) => ({
          ...conv,
          lastUpdated: new Date(conv.lastUpdated)
        })));
        setCurrentConversationId(parsed[0].id);
      } else {
        // If there are no saved conversations, create a new one automatically
        createNewConversation();
      }
    } else {
      // If there's no data in localStorage, create a new conversation automatically
      createNewConversation();
    }
    
    setIsInitialized(true);
  }, [createNewConversation, isInitialized]);

  // Save conversations to localStorage whenever they change
  useEffect(() => {
    if (!isInitialized) return; // Don't save until fully initialized
    localStorage.setItem('conversations', JSON.stringify(conversations));
  }, [conversations, isInitialized]);

  const updateConversationTitle = (conversationId: string, title: string) => {
    setConversations(prev => prev.map(conv => {
      if (conv.id === conversationId) {
        return {
          ...conv,
          title: title.trim() ? title : 'New Chat',
        };
      }
      return conv;
    }));
  };

  const updateConversationMetaInformation = (conversationId: string, metaInformation: string) => {
    setConversations(prev => prev.map(conv => {
      if (conv.id === conversationId) {
        return {
          ...conv,
          metaInformation,
        };
      }
      return conv;
    }));
  };

  const deleteConversation = (conversationId: string) => {
    setConversations(prev => prev.filter(conv => conv.id !== conversationId));
    if (currentConversationId === conversationId) {
      const remaining = conversations.filter(conv => conv.id !== conversationId);
      if (remaining.length > 0) {
        setCurrentConversationId(remaining[0].id);
      } else {
        // Automatically create a new conversation if we deleted the last one
        createNewConversation();
      }
    }
  };

  const addMessageToConversation = (conversationId: string, message: Message) => {
    setConversations(prev => prev.map(conv => {
      if (conv.id === conversationId) {
        const updatedMessages = [...conv.messages, message];
        // Update title if this is the first message and the message is from the user
        if (conv.messages.length === 0 && message.role === 'user') {
          const newTitle = message.content.slice(0, 30) + (message.content.length > 30 ? '...' : '');
          updateConversationTitle(conv.id, newTitle);
        }
        return {
          ...conv,
          messages: updatedMessages,
          lastUpdated: new Date(),
        };
      }
      return conv;
    }));
  };

  const clearConversations = () => {
    if (window.confirm('Are you sure you want to clear all conversations?')) {
      setConversations([]);
      // Create a new conversation automatically after clearing all
      createNewConversation();
    }
  };

  const clearCurrentConversation = () => {
    if (window.confirm('Are you sure you want to clear the current conversation?')) {
      setConversations(prev => prev.map(conv => {
        if (conv.id === currentConversationId) {
          return {
            ...conv,
            messages: [],
            lastUpdated: new Date(),
            title: 'New Chat'
          };
        }
        return conv;
      }));
    }
  };

  const currentConversation = conversations.find(conv => conv.id === currentConversationId);

  return {
    conversations,
    currentConversationId,
    currentConversation,
    setCurrentConversationId,
    createNewConversation,
    deleteConversation,
    addMessageToConversation,
    clearConversations,
    clearCurrentConversation,
    updateConversationMetaInformation,
    updateConversationTitle
  };
} 