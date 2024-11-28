import { StateCreator } from 'zustand';
import { ThesisMetadata } from '../../types/thesis';

export interface MetadataSlice {
  metadata: ThesisMetadata;
  setMetadata: (updates: Partial<ThesisMetadata>) => void;
}

const initialMetadata: ThesisMetadata = {
  title: '',
  field: '',
  supervisor: '',
  university: '',
  citationStyle: 'APA',
  template: 'APA',
  keywords: [],
  abstract: '',
  targetDate: '',
  language: 'en',
  wordCountGoal: 10000,
};

export const createMetadataSlice: StateCreator<MetadataSlice> = (set) => ({
  metadata: initialMetadata,
  setMetadata: (updates) =>
    set((state) => ({
      metadata: { ...state.metadata, ...updates },
    })),
});