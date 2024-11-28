import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';

interface DraggableChapterProps {
  id: string;
  title: string;
  children: React.ReactNode;
}

export function DraggableChapter({ id, title, children }: DraggableChapterProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-white rounded-lg shadow-lg p-6"
    >
      <div className="flex items-center gap-2 mb-4">
        <button
          className="cursor-grab hover:bg-gray-100 p-1 rounded"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="w-5 h-5 text-gray-400" />
        </button>
        <h2 className="text-2xl font-semibold">{title}</h2>
      </div>
      {children}
    </div>
  );
}