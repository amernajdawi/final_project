import { useState, useEffect } from 'react';

// Define the structure for a single file entry from the API
interface FileEntry {
  id: string;
  name: string;
}

// Update the API response interface
interface FileListResponse {
  files: FileEntry[];
  total_files: number;
}

// Update the KnowledgeBaseFile interface to include id
export interface KnowledgeBaseFile {
  id: string; // Keep the document ID
  name: string; // Keep the user-friendly name
  originalName: string; // Keep the original name for reference/deletion if needed
  dateAdded?: string;
}

// Helper function to clean up filenames (no longer needed to generate ID)
// Keep it simple: just use the name from the API
const processFileEntry = (entry: FileEntry): KnowledgeBaseFile => {
  return {
    id: entry.id, // Use the ID from the API
    name: entry.name, // Use the name from the API directly
    originalName: entry.name, // Store original name
    dateAdded: new Date().toISOString() // Keep assuming "now" for date added
  };
};

export function useFileList() {
  const [files, setFiles] = useState<KnowledgeBaseFile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFiles = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('http://localhost:8000/documents/files');
      if (!response.ok) {
        throw new Error('Failed to fetch files');
      }
      // Parse the updated response structure
      const data: FileListResponse = await response.json();
      
      // Process the received FileEntry objects
      const processedFiles = data.files.map(processFileEntry);
      
      setFiles(processedFiles);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setFiles([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  return {
    files,
    isLoading,
    error,
    refresh: fetchFiles
  };
} 