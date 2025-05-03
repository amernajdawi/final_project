import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Message, QARequest, QAResponse, ChatRequest, ChatResponse, ChunkResponse } from '../types/api';

const API_URL = 'http://localhost:8000/chat/process';

export interface ChatApiOptions {
  model: string;
  temperature: number;
  topK: number;
  metaInformation?: string;
  onSuccess?: (message: Message) => void;
  onError?: (message: Message) => void;
}

export function useChatApi() {
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async (userQuery: string, history: Message[] | undefined, options: ChatApiOptions) => {
    if (!userQuery.trim()) return;
    
    setIsLoading(true);

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userQuery,
          history: history,
          top_k: options.topK,
          model: options.model,
          temperature: options.temperature,
          meta_information: options.metaInformation
        } as ChatRequest),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ChatResponse = await response.json();

      if (!data.success) {
        throw new Error(data.message?.content || 'Failed to get response');
      }

      const assistantMessage: Message = {
        id: uuidv4(),
        role: 'assistant',
        content: data.message.content,
        timestamp: new Date(),
        sources: data.chunks,
        expanded_queries: data.expanded_queries,
      };

      if (options.onSuccess) {
        options.onSuccess(assistantMessage);
      }
      
      return assistantMessage;
    } catch (error) {
      console.error('Error:', error);
      
      const errorMessage: Message = {
        id: uuidv4(),
        role: 'assistant',
        content: 'Sorry, there was an error processing your request. Please try again.',
        timestamp: new Date(),
      };
      
      if (options.onError) {
        options.onError(errorMessage);
      }
      
      return errorMessage;
    } finally {
      setIsLoading(false);
    }
  };

  return { sendMessage, isLoading };
} 