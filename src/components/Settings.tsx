import React from 'react';
import { useThesisStore } from '../store/thesisStore';
import { Settings as SettingsIcon, Save, X } from 'lucide-react';

export function Settings() {
  const { metadata, setMetadata } = useThesisStore();
  const [localSettings, setLocalSettings] = React.useState(metadata);

  const handleSave = () => {
    setMetadata({
      ...localSettings,
      showSettings: false
    });
  };

  const handleClose = () => {
    setMetadata({
      ...metadata,
      showSettings: false
    });
  };

  if (!metadata.showSettings) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold flex items-center gap-2">
            <SettingsIcon className="w-6 h-6" />
            Settings
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Citation Style
            </label>
            <select
              value={localSettings.citationStyle}
              onChange={(e) => setLocalSettings({
                ...localSettings,
                citationStyle: e.target.value as 'APA' | 'MLA' | 'Chicago'
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            >
              <option value="APA">APA</option>
              <option value="MLA">MLA</option>
              <option value="Chicago">Chicago</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Document Template
            </label>
            <select
              value={localSettings.template}
              onChange={(e) => setLocalSettings({
                ...localSettings,
                template: e.target.value as 'APA' | 'MLA' | 'Chicago'
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            >
              <option value="APA">APA</option>
              <option value="MLA">MLA</option>
              <option value="Chicago">Chicago</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Target Word Count
            </label>
            <input
              type="number"
              value={localSettings.wordCountGoal}
              onChange={(e) => setLocalSettings({
                ...localSettings,
                wordCountGoal: parseInt(e.target.value)
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Target Completion Date
            </label>
            <input
              type="date"
              value={localSettings.targetDate}
              onChange={(e) => setLocalSettings({
                ...localSettings,
                targetDate: e.target.value
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Language
            </label>
            <select
              value={localSettings.language}
              onChange={(e) => setLocalSettings({
                ...localSettings,
                language: e.target.value
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            >
              <option value="en">English</option>
              <option value="fr">French</option>
              <option value="es">Spanish</option>
              <option value="de">German</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end gap-4 mt-6">
          <button
            onClick={handleClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            <Save className="w-4 h-4" />
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}