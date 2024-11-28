export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          full_name: string;
          avatar_url: string | null;
          role: 'admin' | 'user';
          created_at: string;
        };
        Insert: {
          email: string;
          full_name: string;
          avatar_url?: string;
          role?: 'admin' | 'user';
        };
        Update: {
          email?: string;
          full_name?: string;
          avatar_url?: string;
          role?: 'admin' | 'user';
        };
      };
      theses: {
        Row: {
          id: string;
          title: string;
          user_id: string;
          metadata: Record<string, any>;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          title: string;
          user_id: string;
          metadata?: Record<string, any>;
        };
        Update: {
          title?: string;
          metadata?: Record<string, any>;
          updated_at?: string;
        };
      };
      collaborators: {
        Row: {
          id: string;
          thesis_id: string;
          user_id: string;
          role: 'editor' | 'viewer';
          created_at: string;
        };
        Insert: {
          thesis_id: string;
          user_id: string;
          role: 'editor' | 'viewer';
        };
        Update: {
          role?: 'editor' | 'viewer';
        };
      };
    };
  };
}