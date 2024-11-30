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







// import { create } from 'zustand';
// import { supabase } from '../lib/supabase';
// import { Database } from './types/database'; // Ensure this import path is correct

// // Define the store interface based on your database schema
// interface ThesisState {
//   user: Database['public']['Tables']['users']['Row'] | null;
//   thesis: Database['public']['Tables']['theses']['Row'] | null;
//   collaborators: Database['public']['Tables']['collaborators']['Row'][];
  
//   // Actions
//   setUser: (user: Database['public']['Tables']['users']['Row'] | null) => void;
//   fetchUserData: () => Promise<void>;
//   updateThesisMetadata: (metadata: Record<string, any>) => Promise<void>;
//   addCollaborator: (userId: string, role: 'editor' | 'viewer') => Promise<void>;
//   removeCollaborator: (collaboratorId: string) => Promise<void>;
//   createThesis: (title: string) => Promise<void>;
// }

// // Create the store
// export const useThesisStore = create<ThesisState>()((set, get) => ({
//   user: null,
//   thesis: null,
//   collaborators: [],

//   // Set user in the store
//   setUser: (user) => set({ user }),

//   // Fetch all user-related data
//   fetchUserData: async () => {
//     try {
//       // Get current user
//       const { data: { user } } = await supabase.auth.getUser();
//       if (!user) {
//         set({ user: null, thesis: null, collaborators: [] });
//         return;
//       }

//       // Fetch user details
//       const { data: userData, error: userError } = await supabase
//         .from('users')
//         .select('*')
//         .eq('id', user.id)
//         .single();

//       if (userError) throw userError;

//       // Fetch user's thesis
//       const { data: thesisData, error: thesisError } = await supabase
//         .from('theses')
//         .select('*')
//         .eq('user_id', user.id)
//         .single();

//       if (thesisError && thesisError.code !== 'PGRST116') throw thesisError;

//       // Fetch collaborators if thesis exists
//       let collaboratorsData: Database['public']['Tables']['collaborators']['Row'][] = [];
//       if (thesisData) {
//         const { data: collabData, error: collabError } = await supabase
//           .from('collaborators')
//           .select('*')
//           .eq('thesis_id', thesisData.id);

//         if (collabError) throw collabError;
//         collaboratorsData = collabData || [];
//       }

//       // Update store
//       set({ 
//         user: userData, 
//         thesis: thesisData || null, 
//         collaborators: collaboratorsData 
//       });
//     } catch (error) {
//       console.error('Failed to fetch user data:', error);
//       set({ user: null, thesis: null, collaborators: [] });
//     }
//   },

//   // Update thesis metadata
//   updateThesisMetadata: async (metadata) => {
//     try {
//       const { user, thesis } = get();
//       if (!user || !thesis) throw new Error('No active thesis');

//       const { data, error } = await supabase
//         .from('theses')
//         .update({ 
//           metadata, 
//           updated_at: new Date().toISOString() 
//         })
//         .eq('id', thesis.id)
//         .select()
//         .single();

//       if (error) throw error;

//       // Update local state
//       set({ thesis: data });
//     } catch (error) {
//       console.error('Failed to update thesis metadata:', error);
//       throw error;
//     }
//   },

//   // Create a new thesis
//   createThesis: async (title) => {
//     try {
//       const { user } = get();
//       if (!user) throw new Error('No authenticated user');

//       const { data, error } = await supabase
//         .from('theses')
//         .insert({ 
//           title, 
//           user_id: user.id,
//           metadata: {} 
//         })
//         .select()
//         .single();

//       if (error) throw error;

//       // Update local state
//       set({ thesis: data });
//     } catch (error) {
//       console.error('Failed to create thesis:', error);
//       throw error;
//     }
//   },

//   // Add a collaborator to the thesis
//   addCollaborator: async (userId, role) => {
//     try {
//       const { thesis } = get();
//       if (!thesis) throw new Error('No active thesis');

//       const { data, error } = await supabase
//         .from('collaborators')
//         .insert({ 
//           thesis_id: thesis.id, 
//           user_id: userId,
//           role 
//         })
//         .select()
//         .single();

//       if (error) throw error;

//       // Update local collaborators
//       set(state => ({ 
//         collaborators: [...state.collaborators, data] 
//       }));
//     } catch (error) {
//       console.error('Failed to add collaborator:', error);
//       throw error;
//     }
//   },

//   // Remove a collaborator from the thesis
//   removeCollaborator: async (collaboratorId) => {
//     try {
//       const { error } = await supabase
//         .from('collaborators')
//         .delete()
//         .eq('id', collaboratorId);

//       if (error) throw error;

//       // Update local collaborators
//       set(state => ({ 
//         collaborators: state.collaborators.filter(c => c.id !== collaboratorId) 
//       }));
//     } catch (error) {
//       console.error('Failed to remove collaborator:', error);
//       throw error;
//     }
//   },
// }));

// // Subscribe to auth changes
// supabase.auth.onAuthStateChange(async (event, session) => {
//   const store = useThesisStore.getState();
  
//   if (event === 'SIGNED_IN') {
//     await store.fetchUserData();
//   } else if (event === 'SIGNED_OUT') {
//     store.setUser(null);
//   }
// });

// // Export a helper to initialize the store
// export const initializeThesisStore = async () => {
//   const store = useThesisStore.getState();
//   await store.fetchUserData();
// };
