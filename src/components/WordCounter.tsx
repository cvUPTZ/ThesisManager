import React from 'react';

interface WordCounterProps {
  content: string;
  goal?: number;
}

export function WordCounter({ content, goal }: WordCounterProps) {
  const wordCount = content.trim().split(/\s+/).length;
  const progress = goal ? (wordCount / goal) * 100 : 0;

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-gray-600">{wordCount} words</span>
      {goal && (
        <>
          <div className="w-20 h-2 bg-gray-200 rounded-full">
            <div
              className="h-full bg-blue-500 rounded-full"
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
          <span className="text-sm text-gray-600">{Math.round(progress)}%</span>
        </>
      )}
    </div>
  );
}