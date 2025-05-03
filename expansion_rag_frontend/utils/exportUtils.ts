import { Message } from '../types/api';

interface ExportData {
  messages: Message[];
  exportDate: string;
}

/**
 * Export chat messages as a JSON file
 */
export function exportChatAsJson(messages: Message[]): void {
  const exportData: ExportData = {
    messages,
    exportDate: new Date().toISOString(),
  };
  
  const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `chat-history-${new Date().toISOString()}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
} 