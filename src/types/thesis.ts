export interface ThesisMetadata {
  title: string;
  field: string;
  supervisor: string;
  university: string;
  citationStyle: 'APA' | 'MLA' | 'Chicago';
  template: 'APA' | 'MLA' | 'Chicago';
  keywords: string[];
  abstract: string;
  targetDate: string;
  language: string;
  wordCountGoal: number;
  showSettings?: boolean;
  showTimeline?: boolean;
  showTemplates?: boolean;
  showOutline?: boolean;
}

export interface Chapter {
  id: string;
  title: string;
  order: number;
  sections: Section[];
  lastModified: string;
  notes: string;
}

export interface Section {
  id: string;
  title: string;
  content: string;
  order: number;
  figures: Figure[];
  lastModified: string;
  wordCount: number;
  status: SectionStatus;
}

export interface Figure {
  id: string;
  url: string;
  caption: string;
  altText: string;
  source?: string;
  license?: string;
}

export interface Reference {
  id: string;
  title: string;
  authors: string[];
  year: number;
  type: string;
  url?: string;
  doi?: string;
  journal?: string;
  volume?: string;
  issue?: string;
  pages?: string;
  publisher?: string;
  notes?: string;
  tags: string[];
}

export type SectionStatus = 'draft' | 'review' | 'final';