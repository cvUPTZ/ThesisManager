import React from 'react';
import { useThesisStore } from '../store/thesisStore';
import { ChevronRight, FileText, X, Edit2, Trash2, Plus } from 'lucide-react';

export function OutlineView() {
  const { chapters, metadata, setMetadata, editChapter, deleteChapter, addSection } = useThesisStore();

  if (!metadata.showOutline) return null;

  const handleAddSection = (chapterId: string) => {
    const title = prompt('Enter section title:');
    if (title) {
      addSection(chapterId, title);
    }
  };

  const handleEditChapter = (chapterId: string, currentTitle: string) => {
    const title = prompt('Enter new chapter title:', currentTitle);
    if (title) {
      editChapter(chapterId, title);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Thesis Outline</h2>
          <button
            onClick={() => setMetadata({ ...metadata, showOutline: false })}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-4">
          {chapters.length === 0 ? (
            <p className="text-center text-gray-500 py-4">No chapters yet</p>
          ) : (
            chapters.map((chapter) => (
              <div key={chapter.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 text-lg font-medium">
                    <ChevronRight className="w-5 h-5" />
                    Chapter {chapter.order + 1}: {chapter.title}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEditChapter(chapter.id, chapter.title)}
                      className="p-1 text-gray-400 hover:text-gray-600"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteChapter(chapter.id)}
                      className="p-1 text-gray-400 hover:text-red-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleAddSection(chapter.id)}
                      className="p-1 text-gray-400 hover:text-blue-500"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="ml-6 space-y-2">
                  {chapter.sections.map((section) => (
                    <div key={section.id} className="flex items-center gap-2 text-gray-600">
                      <FileText className="w-4 h-4" />
                      {section.title}
                      <span className="text-sm text-gray-400">
                        ({section.content.trim().split(/\s+/).length} words)
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}