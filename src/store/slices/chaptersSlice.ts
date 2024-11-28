import { StateCreator } from 'zustand';
import { Chapter, Section, Figure } from '../../types/thesis';

export interface ChaptersSlice {
  chapters: Chapter[];
  addChapter: (title: string) => void;
  editChapter: (id: string, title: string) => void;
  deleteChapter: (id: string) => void;
  reorderChapters: (chapterIds: string[]) => void;
  addSection: (chapterId: string, title: string) => void;
  editSection: (chapterId: string, sectionId: string, title: string) => void;
  deleteSection: (chapterId: string, sectionId: string) => void;
  mergeSections: (chapterId: string, sourceId: string, targetId: string) => void;
  addContent: (sectionId: string, content: string) => void;
  editContent: (sectionId: string, content: string) => void;
  viewContent: (sectionId: string) => string;
  addFigure: (sectionId: string, figure: Omit<Figure, 'id'>) => void;
  removeFigure: (sectionId: string, figureId: string) => void;
  updateCaption: (sectionId: string, figureId: string, caption: string) => void;
  listChapters: () => Chapter[];
  listSections: (chapterId: string) => Section[];
  listFigures: (sectionId?: string) => Figure[];
}

export const createChaptersSlice: StateCreator<ChaptersSlice> = (set, get) => ({
  chapters: [],
  
  addChapter: (title) =>
    set((state) => ({
      chapters: [
        ...state.chapters,
        {
          id: crypto.randomUUID(),
          title,
          order: state.chapters.length,
          sections: [],
          lastModified: new Date().toISOString(),
          notes: '',
        },
      ],
    })),

  editChapter: (id, title) =>
    set((state) => ({
      chapters: state.chapters.map((ch) =>
        ch.id === id
          ? { ...ch, title, lastModified: new Date().toISOString() }
          : ch
      ),
    })),

  deleteChapter: (id) =>
    set((state) => ({
      chapters: state.chapters.filter((ch) => ch.id !== id),
    })),

  reorderChapters: (chapterIds) =>
    set((state) => ({
      chapters: chapterIds
        .map((id, index) => {
          const chapter = state.chapters.find((ch) => ch.id === id);
          return chapter ? { ...chapter, order: index } : null;
        })
        .filter((ch): ch is Chapter => ch !== null),
    })),

  addSection: (chapterId, title) =>
    set((state) => ({
      chapters: state.chapters.map((ch) =>
        ch.id === chapterId
          ? {
              ...ch,
              sections: [
                ...ch.sections,
                {
                  id: crypto.randomUUID(),
                  title,
                  content: '',
                  order: ch.sections.length,
                  figures: [],
                  lastModified: new Date().toISOString(),
                  wordCount: 0,
                  status: 'draft',
                },
              ],
              lastModified: new Date().toISOString(),
            }
          : ch
      ),
    })),

  editSection: (chapterId, sectionId, title) =>
    set((state) => ({
      chapters: state.chapters.map((ch) =>
        ch.id === chapterId
          ? {
              ...ch,
              sections: ch.sections.map((sec) =>
                sec.id === sectionId
                  ? {
                      ...sec,
                      title,
                      lastModified: new Date().toISOString(),
                    }
                  : sec
              ),
              lastModified: new Date().toISOString(),
            }
          : ch
      ),
    })),

  deleteSection: (chapterId, sectionId) =>
    set((state) => ({
      chapters: state.chapters.map((ch) =>
        ch.id === chapterId
          ? {
              ...ch,
              sections: ch.sections.filter((sec) => sec.id !== sectionId),
              lastModified: new Date().toISOString(),
            }
          : ch
      ),
    })),

  mergeSections: (chapterId, sourceId, targetId) =>
    set((state) => ({
      chapters: state.chapters.map((ch) => {
        if (ch.id !== chapterId) return ch;

        const sourceSection = ch.sections.find((sec) => sec.id === sourceId);
        const targetSection = ch.sections.find((sec) => sec.id === targetId);

        if (!sourceSection || !targetSection) return ch;

        const mergedContent = `${targetSection.content}\n\n${sourceSection.content}`;
        const mergedFigures = [...targetSection.figures, ...sourceSection.figures];

        return {
          ...ch,
          sections: ch.sections
            .filter((sec) => sec.id !== sourceId)
            .map((sec) =>
              sec.id === targetId
                ? {
                    ...sec,
                    content: mergedContent,
                    figures: mergedFigures,
                    lastModified: new Date().toISOString(),
                    wordCount: mergedContent.trim().split(/\s+/).length,
                  }
                : sec
            ),
          lastModified: new Date().toISOString(),
        };
      }),
    })),

  addContent: (sectionId, content) =>
    set((state) => ({
      chapters: state.chapters.map((ch) => ({
        ...ch,
        sections: ch.sections.map((sec) =>
          sec.id === sectionId
            ? {
                ...sec,
                content,
                lastModified: new Date().toISOString(),
                wordCount: content.trim().split(/\s+/).length,
              }
            : sec
        ),
      })),
    })),

  editContent: (sectionId, content) =>
    set((state) => ({
      chapters: state.chapters.map((ch) => ({
        ...ch,
        sections: ch.sections.map((sec) =>
          sec.id === sectionId
            ? {
                ...sec,
                content,
                lastModified: new Date().toISOString(),
                wordCount: content.trim().split(/\s+/).length,
              }
            : sec
        ),
      })),
    })),

  viewContent: (sectionId) => {
    const section = get()
      .chapters.flatMap((ch) => ch.sections)
      .find((sec) => sec.id === sectionId);
    return section?.content || '';
  },

  addFigure: (sectionId, figure) =>
    set((state) => ({
      chapters: state.chapters.map((ch) => ({
        ...ch,
        sections: ch.sections.map((sec) =>
          sec.id === sectionId
            ? {
                ...sec,
                figures: [...sec.figures, { ...figure, id: crypto.randomUUID() }],
                lastModified: new Date().toISOString(),
              }
            : sec
        ),
      })),
    })),

  removeFigure: (sectionId, figureId) =>
    set((state) => ({
      chapters: state.chapters.map((ch) => ({
        ...ch,
        sections: ch.sections.map((sec) =>
          sec.id === sectionId
            ? {
                ...sec,
                figures: sec.figures.filter((fig) => fig.id !== figureId),
                lastModified: new Date().toISOString(),
              }
            : sec
        ),
      })),
    })),

  updateCaption: (sectionId, figureId, caption) =>
    set((state) => ({
      chapters: state.chapters.map((ch) => ({
        ...ch,
        sections: ch.sections.map((sec) =>
          sec.id === sectionId
            ? {
                ...sec,
                figures: sec.figures.map((fig) =>
                  fig.id === figureId ? { ...fig, caption } : fig
                ),
                lastModified: new Date().toISOString(),
              }
            : sec
        ),
      })),
    })),

  listChapters: () => get().chapters,
  
  listSections: (chapterId) => {
    const chapter = get().chapters.find((ch) => ch.id === chapterId);
    return chapter?.sections || [];
  },
  
  listFigures: (sectionId) => {
    if (!sectionId) {
      return get().chapters.flatMap((ch) =>
        ch.sections.flatMap((sec) => sec.figures)
      );
    }
    const section = get()
      .chapters.flatMap((ch) => ch.sections)
      .find((sec) => sec.id === sectionId);
    return section?.figures || [];
  },
});