import React, { useState } from 'react';
import { useThesisStore } from '../store/thesisStore';
import { Search, Plus, BookOpen, Tag } from 'lucide-react';

export function ReferenceManager() {
  const { references, addReference, searchReferences } = useThesisStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newReference, setNewReference] = useState({
    title: '',
    authors: [''],
    year: new Date().getFullYear(),
    type: 'article',
    tags: [],
  });

  const filteredReferences = searchQuery 
    ? searchReferences(searchQuery)
    : references;

  const handleAddReference = () => {
    addReference({
      ...newReference,
      id: crypto.randomUUID(),
      tags: [],
    });
    setShowAddForm(false);
    setNewReference({
      title: '',
      authors: [''],
      year: new Date().getFullYear(),
      type: 'article',
      tags: [],
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold flex items-center gap-2">
          <BookOpen className="w-6 h-6" />
          References
        </h2>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          <Plus className="w-4 h-4" />
          Add Reference
        </button>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search references..."
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {showAddForm && (
        <div className="mb-6 p-4 border border-gray-200 rounded-lg">
          <h3 className="text-lg font-medium mb-4">Add New Reference</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <input
                type="text"
                value={newReference.title}
                onChange={(e) => setNewReference({ ...newReference, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Authors
              </label>
              {newReference.authors.map((author, index) => (
                <input
                  key={index}
                  type="text"
                  value={author}
                  onChange={(e) => {
                    const newAuthors = [...newReference.authors];
                    newAuthors[index] = e.target.value;
                    setNewReference({ ...newReference, authors: newAuthors });
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-2"
                />
              ))}
              <button
                onClick={() => setNewReference({
                  ...newReference,
                  authors: [...newReference.authors, '']
                })}
                className="text-sm text-blue-500 hover:text-blue-600"
              >
                + Add another author
              </button>
            </div>
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Year
                </label>
                <input
                  type="number"
                  value={newReference.year}
                  onChange={(e) => setNewReference({ ...newReference, year: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type
                </label>
                <select
                  value={newReference.type}
                  onChange={(e) => setNewReference({ ...newReference, type: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="article">Article</option>
                  <option value="book">Book</option>
                  <option value="conference">Conference Paper</option>
                  <option value="thesis">Thesis</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleAddReference}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Add Reference
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {filteredReferences.map((reference) => (
          <div
            key={reference.id}
            className="p-4 border border-gray-200 rounded-lg hover:border-blue-300"
          >
            <h3 className="font-medium">{reference.title}</h3>
            <p className="text-sm text-gray-600">
              {reference.authors.join(', ')} ({reference.year})
            </p>
            {reference.tags.length > 0 && (
              <div className="mt-2 flex items-center gap-2">
                <Tag className="w-4 h-4 text-gray-400" />
                <div className="flex gap-1">
                  {reference.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}