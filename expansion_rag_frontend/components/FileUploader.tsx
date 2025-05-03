'use client';

import { useRef, useState } from 'react';
import { ChevronDown, ChevronUp, File, FileText, Loader2, X, Filter, Trash, Edit, Check } from 'lucide-react';
import { DocumentCategory, ProcessingStatus, UploadedFile } from '../hooks/useFileUpload';
import { useFileList, KnowledgeBaseFile } from '../hooks/useFileList';
import { formatDate, formatFileSize } from '../utils/formatters';

interface FileUploaderProps {
  isUploading: boolean;
  uploadedFiles: UploadedFile[];
  onUpload: (files: FileList | null, category: DocumentCategory) => void;
  onDelete: (fileId: string) => void;
  onDeleteFromKnowledgeBase: (fileId: string) => void;
  onUpdateCategory: (fileId: string, category: DocumentCategory) => void;
  isExpanded: boolean;
  onToggle: () => void;
  categories: DocumentCategory[];
}

export default function FileUploader({
  isUploading,
  uploadedFiles,
  onUpload,
  onDelete,
  onDeleteFromKnowledgeBase,
  onUpdateCategory,
  isExpanded,
  onToggle,
  categories
}: FileUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedCategory, setSelectedCategory] = useState<DocumentCategory>('general');
  const [filterCategory, setFilterCategory] = useState<DocumentCategory | 'all'>('all');
  const [editingFile, setEditingFile] = useState<string | null>(null);
  const [editCategory, setEditCategory] = useState<DocumentCategory>('general');
  const [isKnowledgeBaseExpanded, setIsKnowledgeBaseExpanded] = useState<boolean>(true);
  
  const { files, isLoading: isLoadingFiles, error: filesError, refresh: refreshFiles } = useFileList();

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onUpload(e.dataTransfer.files, selectedCategory);
  };

  // Get status badge color
  const getStatusColor = (status: ProcessingStatus) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'processing': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'failed': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  // Filter files based on selected category
  const filteredFiles = filterCategory === 'all' 
    ? uploadedFiles 
    : uploadedFiles.filter(file => file.category === filterCategory);

  return (
    <div className="border-b border-gray-200 dark:border-gray-700">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
      >
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Document Management
        </div>
        <ChevronDown className={`w-4 h-4 transform transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
      </button>

      {isExpanded && (
        <div className="p-4 animate-slideDown">
          {/* Category selection for upload */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Document Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value as DocumentCategory)}
              className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Drag and drop area */}
          <div
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center cursor-pointer hover:border-blue-500 dark:hover:border-blue-400 transition-colors duration-200"
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={(e) => onUpload(e.target.files, selectedCategory)}
              className="hidden"
              multiple
            />
            <FileText className="w-8 h-8 mx-auto mb-2 text-gray-400 dark:text-gray-500" />
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Drag and drop files here, or click to select
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Supported formats: PDF, TXT, DOC, DOCX
            </p>
          </div>

          {/* Knowledge Base Files Section */}
          <div className="mt-6 border rounded-lg overflow-hidden dark:border-gray-700">
            <button
              onClick={() => setIsKnowledgeBaseExpanded(!isKnowledgeBaseExpanded)}
              className="w-full flex items-center justify-between p-3 text-sm font-medium text-gray-800 dark:text-gray-200 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors border-b dark:border-gray-700"
            >
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-500 dark:text-blue-400" />
                <h3 className="font-semibold text-base">Knowledge Base Files</h3>
                {files.length > 0 && (
                  <span className="ml-2 px-2 py-0.5 text-xs bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full">
                    {files.length}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    refreshFiles();
                  }}
                  className="flex items-center gap-1 text-xs px-2 py-1 rounded-md bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300 dark:hover:bg-blue-800/50 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                    <path d="M3 3v5h5" />
                  </svg>
                  Refresh
                </button>
                <ChevronDown className={`w-4 h-4 transform transition-transform duration-200 ${isKnowledgeBaseExpanded ? 'rotate-180' : ''}`} />
              </div>
            </button>
            
            {isKnowledgeBaseExpanded && (
              <div className="animate-slideDown">
                {isLoadingFiles ? (
                  <div className="flex items-center justify-center gap-2 p-4 bg-white dark:bg-gray-800 rounded-lg">
                    <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
                    <span className="text-sm text-gray-600 dark:text-gray-300">Loading files...</span>
                  </div>
                ) : filesError ? (
                  <div className="p-3 text-sm text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border-t border-red-100 dark:border-red-800/30">
                    Error loading files: {filesError}
                  </div>
                ) : files.length === 0 ? (
                  <div className="p-6 text-center bg-white dark:bg-gray-800">
                    <FileText className="w-10 h-10 mx-auto mb-2 text-gray-300 dark:text-gray-600" />
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      No files in knowledge base
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                      Upload files to get started
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="bg-gray-50 dark:bg-gray-800 px-4 py-2 text-xs font-medium text-gray-500 dark:text-gray-400 border-b dark:border-gray-700">
                      <div className="grid grid-cols-12 gap-2">
                        <div className="col-span-7">Filename</div>
                        <div className="col-span-3">Added</div>
                        <div className="col-span-2 text-right">Actions</div>
                      </div>
                    </div>
                    <div className="divide-y divide-gray-200 dark:divide-gray-700">
                      {files.map((file) => (
                        <div
                          key={file.id}
                          className="px-4 py-3 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors group"
                        >
                          <div className="grid grid-cols-12 gap-2 items-center">
                            <div className="col-span-7 flex items-center gap-3 min-w-0">
                              <div className="p-1.5 rounded-md bg-emerald-50 dark:bg-emerald-900/30 flex-shrink-0">
                                <File className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
                              </div>
                              <a
                                href={`http://localhost:8000/documents/download/${file.id}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate hover:text-blue-600 dark:hover:text-blue-400 underline cursor-pointer"
                                title={file.name}
                              >
                                {file.name}
                              </a>
                            </div>
                            <div className="col-span-3 text-xs text-gray-500 dark:text-gray-400">
                              {file.dateAdded && new Date(file.dateAdded).toLocaleDateString()}
                            </div>
                            <div className="col-span-2 flex justify-end">
                              <button
                                onClick={() => {
                                  if (confirm('Are you sure you want to remove this file from the knowledge base?')) {
                                    onDeleteFromKnowledgeBase(file.originalName);
                                  }
                                }}
                                className="p-1.5 rounded-full hover:bg-red-50 dark:hover:bg-red-900/30 text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                                aria-label="Remove from knowledge base"
                              >
                                <Trash className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Uploaded Files Section */}
          <div className="mt-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Uploaded Documents</h3>
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-gray-400" />
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value as DocumentCategory | 'all')}
                  className="text-xs p-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="all">All Categories</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              {isUploading && (
                <div className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-700 rounded-lg animate-pulse">
                  <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
                  <span className="text-sm text-gray-600 dark:text-gray-300">Uploading...</span>
                </div>
              )}
              
              {filteredFiles.length === 0 && !isUploading && (
                <div className="p-4 text-center text-sm text-gray-500 dark:text-gray-400">
                  No documents found in this category
                </div>
              )}
              
              {filteredFiles.length > 0 && (
                <div className="border rounded-lg overflow-hidden dark:border-gray-700">
                  <div className="bg-gray-50 dark:bg-gray-800 px-4 py-2 text-xs font-medium text-gray-500 dark:text-gray-400 border-b dark:border-gray-700">
                    <div className="grid grid-cols-12 gap-2">
                      <div className="col-span-5">Filename</div>
                      <div className="col-span-5">Details</div>
                      <div className="col-span-2 text-right">Actions</div>
                    </div>
                  </div>
                  <div className="divide-y divide-gray-200 dark:divide-gray-700">
                    {filteredFiles.map((file) => (
                      <div
                        key={file.id}
                        className="px-4 py-3 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors group"
                      >
                        <div className="grid grid-cols-12 gap-2 items-center">
                          <div className="col-span-5 flex items-center gap-3 min-w-0">
                            <File className={`w-4 h-4 flex-shrink-0 ${file.success ? 'text-green-500' : 'text-red-500'}`} />
                            <span className="text-sm font-medium text-gray-900 dark:text-white truncate" title={file.name}>
                              {file.name}
                            </span>
                          </div>
                          <div className="col-span-5 text-xs text-gray-500 dark:text-gray-400 flex items-center gap-2 flex-wrap">
                            <span>{formatFileSize(file.size)}</span>
                            <span>•</span>
                            <span>{formatDate(file.uploadDate)}</span>
                            <span className="px-2 py-0.5 rounded-full bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 text-xxs">
                              {file.category.charAt(0).toUpperCase() + file.category.slice(1)}
                            </span>
                            <span className={`px-2 py-0.5 rounded-full text-xxs ${getStatusColor(file.processingStatus)}`}>
                              {file.processingStatus.charAt(0).toUpperCase() + file.processingStatus.slice(1)}
                            </span>
                          </div>
                          <div className="col-span-2 flex justify-end space-x-1">
                            {editingFile !== file.id ? (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setEditingFile(file.id);
                                  setEditCategory(file.category);
                                }}
                                className="p-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-500 transition-colors opacity-0 group-hover:opacity-100"
                                aria-label="Edit category"
                              >
                                <Edit className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                              </button>
                            ) : (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onUpdateCategory(file.id, editCategory);
                                  setEditingFile(null);
                                }}
                                className="p-1.5 rounded-full hover:bg-green-100 dark:hover:bg-green-800 transition-colors"
                                aria-label="Save category"
                              >
                                <Check className="w-4 h-4 text-green-600 dark:text-green-400" />
                              </button>
                            )}
                            
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                if (confirm('Are you sure you want to remove this document from the knowledge base? This cannot be undone.')) {
                                  onDeleteFromKnowledgeBase(file.id);
                                }
                              }}
                              className="p-1.5 rounded-full hover:bg-red-100 dark:hover:bg-red-900 transition-colors opacity-0 group-hover:opacity-100"
                              aria-label="Remove from knowledge base"
                            >
                              <Trash className="w-4 h-4 text-red-500 dark:text-red-400" />
                            </button>
                            
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onDelete(file.id);
                              }}
                              className="p-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-500 transition-colors opacity-0 group-hover:opacity-100"
                              aria-label="Remove from list"
                            >
                              <X className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                            </button>
                          </div>
                        </div>
                        
                        {editingFile === file.id && (
                          <div className="mt-2 pl-6 col-span-12 sm:col-span-8">
                            <select
                              value={editCategory}
                              onChange={(e) => setEditCategory(e.target.value as DocumentCategory)}
                              className="text-xs p-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-white w-full focus:outline-none focus:ring-1 focus:ring-blue-500"
                            >
                              {categories.map((category) => (
                                <option key={category} value={category}>
                                  {category.charAt(0).toUpperCase() + category.slice(1)}
                                </option>
                              ))}
                            </select>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 