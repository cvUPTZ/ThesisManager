import React from 'react';
import { useThesisStore } from '../store/thesisStore';
import { FileText, Check } from 'lucide-react';

const TEMPLATES = {
  APA: {
    title: 'APA Style Template',
    description: 'American Psychological Association style guide, 7th edition',
    sections: ['Abstract', 'Introduction', 'Method', 'Results', 'Discussion', 'References'],
  },
  MLA: {
    title: 'MLA Style Template',
    description: 'Modern Language Association style guide, 9th edition',
    sections: ['Introduction', 'Body', 'Works Cited'],
  },
  Chicago: {
    title: 'Chicago Style Template',
    description: 'Chicago Manual of Style, 17th edition',
    sections: ['Introduction', 'Main Body', 'Bibliography'],
  },
};

export function TemplateManager() {
  const { metadata, setMetadata } = useThesisStore();
  const [isOpen, setIsOpen] = React.useState(false);

  const handleSelectTemplate = (template: 'APA' | 'MLA' | 'Chicago') => {
    setMetadata({ template });
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Choose Template</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            <FileText className="w-6 h-6" />
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {(Object.entries(TEMPLATES) as [keyof typeof TEMPLATES, typeof TEMPLATES[keyof typeof TEMPLATES]][]).map(([key, template]) => (
            <div
              key={key}
              className={`p-4 border rounded-lg cursor-pointer hover:border-blue-500 ${
                metadata.template === key ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
              }`}
              onClick={() => handleSelectTemplate(key)}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium">{template.title}</h3>
                  <p className="text-sm text-gray-600">{template.description}</p>
                </div>
                {metadata.template === key && (
                  <Check className="w-6 h-6 text-blue-500" />
                )}
              </div>
              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Sections:</h4>
                <div className="flex flex-wrap gap-2">
                  {template.sections.map((section) => (
                    <span
                      key={section}
                      className="px-2 py-1 bg-gray-100 text-gray-600 text-sm rounded"
                    >
                      {section}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end mt-6">
          <button
            onClick={() => setIsOpen(false)}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}