export interface DocumentResponse {
  document_id: string;
  filename: string;
  size: number;
  success: boolean;
  message?: string;
}

export interface TextDocumentRequest {
  content: string;
  filename?: string;
  metadata?: Record<string, any>;
}

export interface ChunkResponse {
  document_id: string;
  chunk_id: string;
  text: string;
  score: number;
  metadata: Record<string, any>;
}

export interface QARequest {
  query: string;
  top_k?: number;
  model?: string;
  temperature?: number;
}

export interface QAResponse {
  answer: string;
  chunks: ChunkResponse[];
  expanded_queries?: string[];
  success: boolean;
}

export interface ChatRequest {
  message: string;
  history?: Message[];
  top_k?: number;
  model?: string;
  temperature?: number;
  meta_information?: string;
}

export interface ChatResponse {
  message: Message;
  chunks: ChunkResponse[];
  expanded_queries: string[];
  success: boolean;
}

export type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  sources?: ChunkResponse[];
  expanded_queries?: string[];
}; 