import React from 'react';
import { useThesisStore } from '../store/thesisStore';

export function Header() {
  const { metadata } = useThesisStore();
  
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto py-4 px-8">
        <h1 className="text-2xl font-bold text-gray-900">
          {metadata.title || 'Thesis Creator Helper'}
        </h1>
      </div>
    </header>
  );
}