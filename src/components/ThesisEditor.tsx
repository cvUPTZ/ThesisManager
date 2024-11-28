import React, { useState } from 'react';
import { useThesisStore } from '../store/thesisStore';
import { Book, GraduationCap, User, Building, Calendar, Hash } from 'lucide-react';
import { DndContext, closestCenter, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { DraggableChapter } from './DraggableChapter';
import { StatusBadge } from './StatusBadge';
import { WordCounter } from './WordCounter';
import ReactMarkdown from 'react-markdown';
import { format } from 'date-fns';

export function ThesisEditor() {
  const { metadata, chapters, reorderChapters } = useThesisStore();
  const [expandedChapter, setExpandedChapter] = useState<string | null>(null);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      const oldIndex = chapters.findIndex(ch => ch.id === active.id);
      const newIndex = chapters.findIndex(ch => ch.id === over.id);
      
      const newOrder = [...chapters];
      const [movedChapter] = newOrder.splice(oldIndex, 1);
      newOrder.splice(newIndex, 0, movedChapter);
      
      reorderChapters(newOrder.map(ch => ch.id));
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8 pb-24">
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h1 className="text-3xl font-bold mb-6">{metadata.title || 'Untitled Thesis'}</h1>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="flex items-center gap-2">
            <Book className="w-5 h-5 text-blue-500" />
            <span>{metadata.field || 'Field not set'}</span>
          </div>
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-blue-500" />
            <span>{metadata.supervisor || 'Supervisor not set'}</span>
          </div>
          <div className="flex items-center gap-2">
            <Building className="w-5 h-5 text-blue-500" />
            <span>{metadata.university || 'University not set'}</span>
          </div>
          <div className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-blue-500" />
            <span>Template: {metadata.template}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-500" />
            <span>Target: {metadata.targetDate ? format(new Date(metadata.targetDate), 'MMM d, yyyy') : 'Not set'}</span>
          </div>
          <div className="flex items-center gap-2">
            <Hash className="w-5 h-5 text-blue-500" />
            <span>Keywords: {metadata.keywords?.join(', ') || 'None'}</span>
          </div>
        </div>

        {metadata.abstract && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <h2 className="text-lg font-semibold mb-2">Abstract</h2>
            <ReactMarkdown className="prose prose-sm">{metadata.abstract}</ReactMarkdown>
          </div>
        )}
      </div>

      <DndContext
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={chapters.map(ch => ch.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-6">
            {chapters.map((chapter) => (
              <DraggableChapter
                key={chapter.id}
                id={chapter.id}
                title={`Chapter ${chapter.order + 1}: ${chapter.title}`}
              >
                <div className="text-sm text-gray-500 mb-4">
                  Last modified: {format(new Date(chapter.lastModified), 'MMM d, yyyy HH:mm')}
                </div>

                {chapter.notes && (
                  <div className="mb-4 p-3 bg-yellow-50 rounded-lg">
                    <ReactMarkdown className="prose prose-sm">{chapter.notes}</ReactMarkdown>
                  </div>
                )}

                <div className="space-y-4">
                  {chapter.sections.map((section) => (
                    <div
                      key={section.id}
                      className="border-l-4 border-blue-500 pl-4"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-xl font-medium">{section.title}</h3>
                        <StatusBadge status={section.status} />
                      </div>

                      <WordCounter
                        content={section.content}
                        goal={metadata.wordCountGoal}
                      />

                      <div className="prose prose-sm mt-2">
                        <ReactMarkdown>{section.content || 'No content yet'}</ReactMarkdown>
                      </div>

                      {section.figures.length > 0 && (
                        <div className="mt-4 grid grid-cols-2 gap-4">
                          {section.figures.map((figure) => (
                            <figure key={figure.id} className="text-center">
                              <img
                                src={figure.url}
                                alt={figure.altText}
                                className="rounded-lg shadow-md"
                              />
                              <figcaption className="mt-2 text-sm text-gray-600">
                                {figure.caption}
                                {figure.source && (
                                  <div className="text-xs text-gray-500">
                                    Source: {figure.source}
                                  </div>
                                )}
                              </figcaption>
                            </figure>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </DraggableChapter>
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}