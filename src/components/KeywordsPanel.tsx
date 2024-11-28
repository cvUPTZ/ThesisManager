import React from 'react';
import { useThesisStore } from '../store/thesisStore';
import { Tag, Plus, X } from 'lucide-react';

export function KeywordsPanel() {
  const { metadata, setMetadata } = useThesisStore();
  const [newKeyword, setNewKeyword] = React.useState('');

  const addKeyword = () => {
    if (newKeyword.trim() && !metadata.keywords?.includes(newKeyword.trim())) {
      setMetadata({
        keywords: [...(metadata.keywords || []), newKeyword.trim()]
      });
      setNewKeyword('');
    }
  };

  const removeKeyword = (keyword: string) => {
    setMetadata({
      keywords: metadata.keywords?.filter(k => k !== keyword) || []
    });
  };

  return (
    <div className="fixed inset-y-0 right-0 w-96 bg-white shadow-lg transform transition-transform duration-200 ease-in-out overflow-y-auto">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold flex items-center gap-2">
            <Tag className="w-6 h-6" />
            Keywords
          </h2>
        </div>

        <div className="mb-6">
          <div className="flex gap-2">
            <input
              type="text"
              value={newKeyword}
              onChange={(e) => setNewKeyword(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  addKeyword();
                }
              }}
              placeholder="Add new keyword"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={addKeyword}
              className="flex items-center gap-1 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              <Plus className="w-4 h-4" />
              Add
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {metadata.keywords?.map((keyword) => (
            <div
              key={keyword}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <span>{keyword}</span>
              <button
                onClick={() => removeKeyword(keyword)}
                className="p-1 text-gray-400 hover:text-red-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}