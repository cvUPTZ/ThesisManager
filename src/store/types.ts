import { User } from '@supabase/supabase-js';
import { ThesisMetadata, Chapter, Reference } from '../types/thesis';

export interface StoreState {
  metadata: ThesisMetadata;
  chapters: Chapter[];
  references: Reference[];
  user: User | null;
}

export interface StoreActions {
  setMetadata: (updates: Partial<ThesisMetadata>) => void;
  setChapters: (chapters: Chapter[]) => void;
  setReferences: (references: Reference[]) => void;
  setUser: (user: User | null) => void;
}

export type Store = StoreState & StoreActions;