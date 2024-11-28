import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createMetadataSlice, MetadataSlice } from './slices/metadataSlice';
import { createChaptersSlice, ChaptersSlice } from './slices/chaptersSlice';
import { createReferencesSlice, ReferencesSlice } from './slices/referencesSlice';
import { supabase } from '../lib/supabase';
import { Store } from './types';

// Create the store with persistence and Supabase sync
export const useThesisStore = create<Store>()(
  persist(
    (...a) => ({
      ...createMetadataSlice(...a),
      ...createChaptersSlice(...a),
      ...createReferencesSlice(...a),
      user: null,
      setUser: (user) => {
        a[0]((state) => ({ ...state, user }));
        if (!user) {
          // Clear store data on logout
          a[0]((state) => ({
            ...state,
            metadata: {
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
            },
            chapters: [],
            references: [],
          }));
        }
      },
    }),
    {
      name: 'thesis-store',
      partialize: (state) => ({
        metadata: state.metadata,
        chapters: state.chapters,
        references: state.references,
      }),
    }
  )
);

// Initialize store with user data
export async function initializeStore() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  try {
    // Fetch thesis data
    const { data: thesis } = await supabase
      .from('theses')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (thesis) {
      useThesisStore.getState().setMetadata({
        title: thesis.title,
        field: thesis.field,
        supervisor: thesis.supervisor,
        university: thesis.university,
        citationStyle: thesis.citation_style,
        template: thesis.template,
        keywords: thesis.keywords,
        abstract: thesis.abstract,
        targetDate: thesis.target_date,
        language: thesis.language,
        wordCountGoal: thesis.word_count_goal,
      });

      // Set up real-time subscription
      const thesisSubscription = supabase
        .channel('thesis_changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'theses',
            filter: `user_id=eq.${user.id}`,
          },
          (payload) => {
            if (payload.new) {
              useThesisStore.getState().setMetadata({
                title: payload.new.title,
                field: payload.new.field,
                supervisor: payload.new.supervisor,
                university: payload.new.university,
                citationStyle: payload.new.citation_style,
                template: payload.new.template,
                keywords: payload.new.keywords,
                abstract: payload.new.abstract,
                targetDate: payload.new.target_date,
                language: payload.new.language,
                wordCountGoal: payload.new.word_count_goal,
              });
            }
          }
        )
        .subscribe();

      return () => {
        thesisSubscription.unsubscribe();
      };
    }
  } catch (error) {
    console.error('Failed to initialize store:', error);
  }
}

// Subscribe to auth changes
supabase.auth.onAuthStateChange((event, session) => {
  useThesisStore.getState().setUser(session?.user ?? null);
  if (event === 'SIGNED_OUT') {
    // Clear store data
    useThesisStore.getState().setMetadata({
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
    });
    useThesisStore.getState().setChapters([]);
    useThesisStore.getState().setReferences([]);
  }
});