import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/database';

const supabaseUrl = 'https://panoybjcksflavfhgyvv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBhbm95Ympja3NmbGF2ZmhneXZ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjkzNjk1MTksImV4cCI6MjA0NDk0NTUxOX0.HAeRGm94Gh-DIXDlDGxi7-bgnTF3rRa1prQX4YBvt9U';

export const supabase = createClient<Database>(supabaseUrl, supabaseKey);