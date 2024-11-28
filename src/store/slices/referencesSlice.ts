import { StateCreator } from 'zustand';
import { Reference, ThesisMetadata } from '../../types/thesis';

export interface ReferencesSlice {
  references: Reference[];
  addReference: (reference: Omit<Reference, 'id'>) => void;
  removeReference: (id: string) => void;
  updateReference: (id: string, updates: Partial<Reference>) => void;
  searchReferences: (query: string) => Reference[];
  generateBibliography: () => string;
}

export const createReferencesSlice: StateCreator<
  ReferencesSlice & { metadata: ThesisMetadata }
> = (set, get) => ({
  references: [],

  addReference: (reference) =>
    set((state) => ({
      references: [
        ...state.references,
        { ...reference, id: crypto.randomUUID() },
      ],
    })),

  removeReference: (id) =>
    set((state) => ({
      references: state.references.filter((ref) => ref.id !== id),
    })),

  updateReference: (id, updates) =>
    set((state) => ({
      references: state.references.map((ref) =>
        ref.id === id ? { ...ref, ...updates } : ref
      ),
    })),

  searchReferences: (query) => {
    const { references } = get();
    if (!query) return references;

    const searchTerms = query.toLowerCase().split(/\s+/);
    return references.filter((ref) =>
      searchTerms.every(
        (term) =>
          ref.title.toLowerCase().includes(term) ||
          ref.authors.some((author) =>
            author.toLowerCase().includes(term)
          ) ||
          ref.tags.some((tag) => tag.toLowerCase().includes(term))
      )
    );
  },

  generateBibliography: () => {
    const { references, metadata } = get();
    const sortedRefs = [...references].sort((a, b) => {
      const authorA = a.authors[0] || '';
      const authorB = b.authors[0] || '';
      return authorA.localeCompare(authorB);
    });

    return sortedRefs
      .map((ref) => {
        switch (metadata.citationStyle) {
          case 'APA':
            return `${ref.authors.join(', ')} (${ref.year}). ${ref.title}. ${
              ref.publisher
            }.`;
          case 'MLA':
            return `${ref.authors.join(', ')}. "${ref.title}." ${
              ref.publisher
            }, ${ref.year}.`;
          case 'Chicago':
            return `${ref.authors.join(', ')}. ${ref.title}. ${
              ref.publisher
            }, ${ref.year}.`;
          default:
            return `${ref.authors.join(', ')} (${ref.year}). ${ref.title}.`;
        }
      })
      .join('\n\n');
  },
});