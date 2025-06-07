import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface DbTodo {
  id: string;
  title: string;
  url: string;
  due_date: string;
  completed: boolean;
  section_id: string;
  created_at: string;
}

export interface DbSection {
  id: string;
  title: string;
  is_expanded: boolean;
  created_at: string;
  user_id: string;
} 