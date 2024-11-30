import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '../../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { useThesisStore } from '../../store/thesisStore';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName: string) => Promise<void>;
  signOut: () => Promise<void>;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { setUser: setStoreUser } = useThesisStore();

  useEffect(() => {
    // Check active sessions
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setUser(session?.user ?? null);
        setStoreUser(session?.user ?? null);
      } catch (error) {
        console.error('Error checking session:', error);
      } finally {
        setLoading(false);
      }
    };

    checkSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setStoreUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [setStoreUser]);

  const signIn = async (email: string, password: string) => {
    try {
      setError(null);
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      navigate('/thesis');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to sign in');
      throw error;
    }
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      setError(null);
      const { error: signUpError, data } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName
          }
        }
      });

      if (signUpError) throw signUpError;

      if (data.user) {
        // Create user profile
        const { error: profileError } = await supabase.from('users').insert({
          id: data.user.id,
          email,
          full_name: fullName
        });

        if (profileError) throw profileError;

        // Create default thesis
        const { error: thesisError } = await supabase.from('theses').insert({
          user_id: data.user.id,
          title: 'My Thesis',
          template: 'APA',
          citation_style: 'APA'
        });

        if (thesisError) throw thesisError;

        navigate('/thesis');
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to sign up');
      throw error;
    }
  };

  const signOut = async () => {
    try {
      setError(null);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
      setStoreUser(null);
      navigate('/');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to sign out');
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut, error }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}













// import React, { createContext, useContext, useEffect, useState } from 'react';
// import { User } from '@supabase/supabase-js';
// import { supabase } from '../../lib/supabase';
// import { useNavigate } from 'react-router-dom';
// import { useThesisStore } from '../../store/thesisStore';

// interface AuthContextType {
//   user: User | null;
//   loading: boolean;
//   signIn: (email: string, password: string) => Promise<void>;
//   signUp: (email: string, password: string, fullName: string) => Promise<void>;
//   signOut: () => Promise<void>;
//   error: string | null;
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export function AuthProvider({ children }: { children: React.ReactNode }) {
//   const [user, setUser] = useState<User | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const navigate = useNavigate();
  
//   // Use the store methods directly
//   const { setUser: setStoreUser, fetchUserData } = useThesisStore();

//   useEffect(() => {
//     // Check active sessions
//     const checkSession = async () => {
//       try {
//         const { data: { session } } = await supabase.auth.getSession();
//         setUser(session?.user ?? null);
//         setStoreUser(session?.user ?? null);
        
//         // If user is signed in, fetch user data
//         if (session?.user) {
//           await fetchUserData();
//         }
//       } catch (error) {
//         console.error('Error checking session:', error);
//       } finally {
//         setLoading(false);
//       }
//     };
    
//     checkSession();
    
//     // Listen for auth changes
//     const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
//       setUser(session?.user ?? null);
//       setStoreUser(session?.user ?? null);
      
//       // If user is signed in, fetch user data
//       if (session?.user) {
//         await fetchUserData();
//       }
      
//       setLoading(false);
//     });
    
//     return () => subscription.unsubscribe();
//   }, [setStoreUser, fetchUserData]);


//   const signIn = async (email: string, password: string) => {
//     try {
//       setError(null);
//       const { error } = await supabase.auth.signInWithPassword({ email, password });
//       if (error) throw error;
//       navigate('/thesis');
//     } catch (error) {
//       setError(error instanceof Error ? error.message : 'Failed to sign in');
//       throw error;
//     }
//   };

  
//   const signIn = async (email: string, password: string) => {
//     try {
//       setError(null);
//       const { error } = await supabase.auth.signInWithPassword({ email, password });
//       if (error) throw error;
//       navigate('/thesis');
//     } catch (error) {
//       setError(error instanceof Error ? error.message : 'Failed to sign in');
//       throw error;
//     }
//   };

//   const signUp = async (email: string, password: string, fullName: string) => {
//     try {
//       setError(null);
//       const { error: signUpError, data } = await supabase.auth.signUp({
//         email,
//         password,
//         options: {
//           data: {
//             full_name: fullName
//           }
//         }
//       });
      
//       if (signUpError) throw signUpError;
      
//       if (data.user) {
//         // Create user profile
//         const { error: profileError } = await supabase.from('users').insert({
//           id: data.user.id,
//           email,
//           full_name: fullName
//         });
        
//         if (profileError) throw profileError;
        
//         // Create default thesis using the store method
//         const { createThesis } = useThesisStore.getState();
//         await createThesis('My Thesis');
        
//         navigate('/thesis');
//       }
//     } catch (error) {
//       setError(error instanceof Error ? error.message : 'Failed to sign up');
//       throw error;
//     }
//   };

//   const signOut = async () => {
//     try {
//       setError(null);
//       const { error } = await supabase.auth.signOut();
      
//       if (error) throw error;
      
//       // Reset the store state
//       const { setUser: resetStoreUser } = useThesisStore.getState();
//       resetStoreUser(null);
      
//       setUser(null);
//       navigate('/');
//     } catch (error) {
//       setError(error instanceof Error ? error.message : 'Failed to sign out');
//       throw error;
//     }
//   };

//   return (
//     <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut, error }}>
//       {children}
//     </AuthContext.Provider>
//   );
// }

// export function useAuth() {
//   const context = useContext(AuthContext);
//   if (context === undefined) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// }
