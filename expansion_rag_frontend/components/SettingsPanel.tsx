'use client';

interface ModelOption {
  id: string;
  name: string;
}

interface SettingsPanelProps {
  selectedModel: string;
  onModelChange: (model: string) => void;
  temperature: number;
  onTemperatureChange: (temp: number) => void;
  topK: number;
  onTopKChange: (k: number) => void;
  models: ModelOption[];
}

export default function SettingsPanel({
  selectedModel,
  onModelChange,
  temperature,
  onTemperatureChange,
  topK,
  onTopKChange,
  models
}: SettingsPanelProps) {
  return (
    <div className="p-6 bg-white dark:bg-gray-800 border-b dark:border-gray-700 shadow-sm animate-slideDown">
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Model</label>
          <select
            value={selectedModel}
            onChange={(e) => onModelChange(e.target.value)}
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 dark:text-white transition-colors duration-200"
          >
            {models.map((model) => (
              <option key={model.id} value={model.id}>
                {model.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
            Temperature: {temperature}
          </label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={temperature}
            onChange={(e) => onTemperatureChange(parseFloat(e.target.value))}
            className="w-full accent-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
            Retrieved Documents (Top K): {topK}
          </label>
          <input
            type="range"
            min="1"
            max="10"
            step="1"
            value={topK}
            onChange={(e) => onTopKChange(parseInt(e.target.value, 10))}
            className="w-full accent-blue-500"
          />
        </div>
      </div>
    </div>
  );
} 