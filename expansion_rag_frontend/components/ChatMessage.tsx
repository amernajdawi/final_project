'use client';

import { useState } from 'react';
import { Message, ChunkResponse } from '../types/api';
import { Copy, ChevronDown, ChevronUp, X, BookOpen, Star, FileText, BookCopy, Search, MoreHorizontal } from 'lucide-react';
import { formatTimestamp } from '../utils/formatters';

interface ChatMessageProps {
  message: Message;
  onCopy: (content: string) => void;
}

export default function ChatMessage({ message, onCopy }: ChatMessageProps) {
  const [expandedQueries, setExpandedQueries] = useState(false);
  const [expandedSources, setExpandedSources] = useState(false);
  const [selectedSource, setSelectedSource] = useState<ChunkResponse | null>(null);

  const toggleExpandedQueries = (e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedQueries(!expandedQueries);
  };
  
  const toggleSources = (e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedSources(!expandedSources);
  };

  const handleSourceClick = (source: ChunkResponse) => {
    setSelectedSource(source);
  };

  const closeReference = () => {
    setSelectedSource(null);
  };
  
  const truncateText = (text: string, maxLength: number = 200) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <div
      className={`flex animate-fadeIn ${
        message.role === 'user' ? 'justify-end' : 'justify-start'
      } relative`}
    >
      <div
        className={`max-w-[80%] rounded-2xl p-4 shadow-md transition-all duration-200 ${
          message.role === 'user'
            ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
            : 'bg-white dark:bg-gray-800 shadow-md dark:text-white'
        }`}
      >
        <div className="flex justify-between items-start gap-4">
          <p className="whitespace-pre-wrap flex-grow leading-relaxed">{message.content}</p>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onCopy(message.content);
            }}
            className="ml-2 p-1.5 rounded-lg hover:bg-black/10 dark:hover:bg-white/10 opacity-60 hover:opacity-100 transition-all duration-200"
            aria-label="Copy message"
          >
            <Copy className="w-4 h-4" />
          </button>
        </div>
        
        <div className="mt-2 text-xs opacity-70">
          {formatTimestamp(new Date(message.timestamp))}
        </div>
        
        {/* Sources Section */}
        {message.sources && message.sources.length > 0 && (
          <div className="mt-3 pt-3 border-t border-gray-200/20 dark:border-gray-700/50">
            <button
              onClick={toggleSources}
              className="flex items-center text-xs opacity-70 hover:opacity-100 transition-colors duration-200"
            >
              <BookCopy className="w-4 h-4 mr-1 text-blue-400" />
              <span className="mr-1">{message.sources.length} {message.sources.length === 1 ? 'Source' : 'Sources'}</span>
              {expandedSources ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>
            
            {expandedSources && (
              <div className="mt-2 space-y-2 animate-slideDown">
                {message.sources.map((source) => {
                  // Extract filename and page number
                  const filename = source.metadata.filename || "Document";
                  const pageNumber = source.metadata.page_number;
                  const hasPageNumber = pageNumber !== null && pageNumber !== undefined;
                  
                  // Construct the PDF link URL
                  const pdfLink = `http://localhost:8000/documents/download/${source.document_id}${hasPageNumber ? `#page=${pageNumber}` : ''}`;
                  
                  // --- Add console log for debugging ---
                  console.log('Source Metadata:', source.metadata, 'Page:', pageNumber, 'Link:', pdfLink);
                  
                  return (
                    <div
                      key={source.chunk_id}
                      // Keep the outer div clickable for the sidebar, but stop propagation from the link
                      className="text-xs bg-black/5 dark:bg-white/5 p-3 rounded-lg leading-relaxed cursor-pointer hover:bg-black/10 dark:hover:bg-white/10 transition-colors duration-200 border border-transparent hover:border-blue-200 dark:hover:border-blue-800"
                      onClick={() => handleSourceClick(source)}
                    >
                      <div className="flex items-center mb-1 text-blue-500 dark:text-blue-400">
                        <FileText className="w-3.5 h-3.5 mr-1 flex-shrink-0" />
                        {/* Make the filename an anchor tag pointing to the PDF page */}
                        <a 
                          href={pdfLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()} // Prevent opening sidebar when clicking link
                          className="truncate font-medium hover:underline"
                          title={`Open ${filename}${hasPageNumber ? ` at page ${pageNumber}` : ''}`}
                        >
                          {filename}
                          {hasPageNumber && ` (Page ${pageNumber})`}
                        </a>
                      </div>
                      <div className="flex items-start">
                        {/* Make the text snippet itself also clickable for the sidebar */}
                        <span className="inline-block pr-1 cursor-pointer" onClick={(e) => { e.stopPropagation(); handleSourceClick(source); }}>
                          {truncateText(source.text)}
                        </span>
                        {source.text.length > 200 && (
                          <MoreHorizontal className="w-3.5 h-3.5 text-gray-400 flex-shrink-0 mt-0.5" />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
        
        {/* Expanded Queries Section */}
        {message.expanded_queries && message.expanded_queries.length > 0 && (
          <div className="mt-3 pt-3 border-t border-gray-200/20 dark:border-gray-700/50">
            <button
              onClick={toggleExpandedQueries}
              className="flex items-center text-xs opacity-70 hover:opacity-100 transition-colors duration-200"
            >
              <Search className="w-4 h-4 mr-1 text-purple-400" />
              <span className="mr-1">{message.expanded_queries.length} Expanded {message.expanded_queries.length === 1 ? 'Query' : 'Queries'}</span>
              {expandedQueries ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>
            {expandedQueries && (
              <div className="mt-2 space-y-2 animate-slideDown">
                {message.expanded_queries.map((query, index) => (
                  <div
                    key={`query-${index}`}
                    className="text-xs bg-black/5 dark:bg-white/5 p-3 rounded-lg leading-relaxed border border-transparent hover:border-purple-200 dark:hover:border-purple-800 transition-colors duration-200"
                  >
                    <div className="flex items-center mb-1 text-purple-500 dark:text-purple-400">
                      <Search className="w-3.5 h-3.5 mr-1 flex-shrink-0" />
                      <span className="font-medium">Expanded Query {index + 1}</span>
                    </div>
                    <span className="italic">"{query}"</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Reference Panel */}
      {selectedSource && (
        <div className="fixed right-0 top-0 h-full w-96 bg-gradient-to-b from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 shadow-xl z-50 overflow-y-auto animate-slideInRight border-l border-gray-200 dark:border-gray-700">
          <div className="sticky top-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-4 border-b border-gray-200 dark:border-gray-700 z-10">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-lg flex items-center text-gray-800 dark:text-white">
                <BookOpen className="w-5 h-5 mr-2 text-blue-500" />
                Reference
              </h3>
              <button 
                onClick={closeReference}
                className="p-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          <div className="p-4 space-y-6">
            {/* PDF Name */}
            <div className="rounded-xl overflow-hidden shadow-sm">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-3 text-white">
                <div className="text-xs uppercase tracking-wider opacity-70">Document</div>
              </div>
              <div className="p-4 bg-white dark:bg-gray-800 border-x border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center">
                  <FileText className="w-5 h-5 mr-2 text-blue-500 flex-shrink-0" />
                  <div className="font-medium text-sm truncate">
                    {selectedSource.metadata.filename || "Document"}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Chunk with context */}
            <div className="rounded-xl overflow-hidden shadow-sm">
              <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-3 text-white">
                <div className="text-xs uppercase tracking-wider opacity-70">Content</div>
              </div>
              <div className="bg-white dark:bg-gray-800 border-x border-b border-gray-200 dark:border-gray-700">
                <div className="px-4 py-2 text-xs text-gray-500 dark:text-gray-400 italic border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">...</div>
                <div className="p-4 text-sm font-medium border-b border-gray-100 dark:border-gray-700">
                  <div className="bg-yellow-50 dark:bg-yellow-900/10 px-3 py-2 rounded-lg border border-yellow-100 dark:border-yellow-900/20">
                    {selectedSource.text}
                  </div>
                </div>
                <div className="px-4 py-2 text-xs text-gray-500 dark:text-gray-400 italic bg-gray-50 dark:bg-gray-800/50">...</div>
              </div>
            </div>
            
            {/* Metadata */}
            <div className="rounded-xl overflow-hidden shadow-sm">
              <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-3 text-white">
                <div className="text-xs uppercase tracking-wider opacity-70">Metadata</div>
              </div>
              <div className="bg-white dark:bg-gray-800 border-x border-b border-gray-200 dark:border-gray-700 p-4">
                <div className="flex items-center mb-3">
                  <Star className="w-4 h-4 text-amber-400 mr-1" />
                  <span className="text-sm">Relevance Score: <span className="font-medium">{selectedSource.score.toFixed(2)}</span></span>
                </div>
                
                <div className="space-y-2">
                  <div className="grid grid-cols-3 gap-1 items-center text-xs">
                    <span className="font-medium text-gray-500 dark:text-gray-400 col-span-1">Document ID</span>
                    <span className="truncate col-span-2 bg-gray-50 dark:bg-gray-700 px-2 py-1 rounded">
                      {selectedSource.document_id}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-1 items-center text-xs">
                    <span className="font-medium text-gray-500 dark:text-gray-400 col-span-1">Chunk ID</span>
                    <span className="truncate col-span-2 bg-gray-50 dark:bg-gray-700 px-2 py-1 rounded">
                      {selectedSource.chunk_id}
                    </span>
                  </div>
                  
                  {Object.entries(selectedSource.metadata).map(([key, value]) => (
                    key !== 'filename' && (
                      <div key={key} className="grid grid-cols-3 gap-1 items-center text-xs">
                        <span className="font-medium text-gray-500 dark:text-gray-400 col-span-1 capitalize">{key}</span>
                        <span className="truncate col-span-2 bg-gray-50 dark:bg-gray-700 px-2 py-1 rounded">
                          {String(value)}
                        </span>
                      </div>
                    )
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 