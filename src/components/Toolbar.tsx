import React from 'react';
import { useThesisStore } from '../store/thesisStore';
import {
  Download,
  FileText,
  BookOpen,
  Settings as SettingsIcon,
  List,
  PlusCircle,
} from 'lucide-react';
import { exportToDocx } from '../utils/docxExport';

export function Toolbar() {
  const store = useThesisStore();
  const { generateBibliography, setMetadata, metadata, addChapter, chapters, references } = store;

  const handleExport = async () => {
    try {
      await exportToDocx({
        metadata,
        chapters,
        references
      });
    } catch (error) {
      console.error('Failed to export:', error);
    }
  };

  const handleBibliography = () => {
    const bibliography = generateBibliography();
    const blob = new Blob([bibliography], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'bibliography.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleNewChapter = () => {
    const title = prompt('Enter chapter title:');
    if (title) {
      addChapter(title);
    }
  };

  return (
    <div className="bg-white border-b border-gray-200 py-2">
      <div className="max-w-4xl mx-auto px-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
          >
            <Download className="w-5 h-5" />
            Export DOCX
          </button>
          <button
            onClick={handleBibliography}
            className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
          >
            <BookOpen className="w-5 h-5" />
            Bibliography
          </button>
          <button 
            onClick={() => setMetadata({ ...metadata, showTemplates: true })}
            className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
          >
            <FileText className="w-5 h-5" />
            Templates
          </button>
          <button 
            onClick={() => setMetadata({ ...metadata, showSettings: true })}
            className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
          >
            <SettingsIcon className="w-5 h-5" />
            Settings
          </button>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setMetadata({ ...metadata, showOutline: true })}
            className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
          >
            <List className="w-5 h-5" />
            Outline
          </button>
          <button 
            onClick={handleNewChapter}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            <PlusCircle className="w-5 h-5" />
            New Chapter
          </button>
        </div>
      </div>
    </div>
  );
}