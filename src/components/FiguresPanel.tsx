import React from 'react';
import { useThesisStore } from '../store/thesisStore';
import { Image, Trash2, Edit2 } from 'lucide-react';

export function FiguresPanel() {
  const { chapters, removeFigure, updateCaption } = useThesisStore();
  const [editingFigure, setEditingFigure] = React.useState<{id: string, caption: string} | null>(null);

  const allFigures = chapters.flatMap(chapter =>
    chapter.sections.flatMap(section =>
      section.figures.map(figure => ({
        ...figure,
        sectionId: section.id,
        chapterTitle: chapter.title,
        sectionTitle: section.title
      }))
    )
  );

  const handleUpdateCaption = (sectionId: string, figureId: string, caption: string) => {
    updateCaption(sectionId, figureId, caption);
    setEditingFigure(null);
  };

  return (
    <div className="fixed inset-y-0 right-0 w-96 bg-white shadow-lg transform transition-transform duration-200 ease-in-out overflow-y-auto">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold flex items-center gap-2">
            <Image className="w-6 h-6" />
            Figures
          </h2>
        </div>

        <div className="space-y-6">
          {allFigures.map((figure) => (
            <div key={figure.id} className="border border-gray-200 rounded-lg p-4">
              <img
                src={figure.url}
                alt={figure.altText}
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
              
              {editingFigure?.id === figure.id ? (
                <div className="space-y-2">
                  <textarea
                    value={editingFigure.caption}
                    onChange={(e) => setEditingFigure({
                      ...editingFigure,
                      caption: e.target.value
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    rows={3}
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => setEditingFigure(null)}
                      className="px-3 py-1 text-gray-600 hover:text-gray-800"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleUpdateCaption(
                        figure.sectionId,
                        figure.id,
                        editingFigure.caption
                      )}
                      className="px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                    >
                      Save
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <p className="text-sm text-gray-600 mb-2">{figure.caption}</p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">
                      {figure.chapterTitle} - {figure.sectionTitle}
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setEditingFigure({
                          id: figure.id,
                          caption: figure.caption
                        })}
                        className="p-1 text-gray-400 hover:text-gray-600"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => removeFigure(figure.sectionId, figure.id)}
                        className="p-1 text-gray-400 hover:text-red-500"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}