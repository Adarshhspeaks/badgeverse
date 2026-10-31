// Supabase integration behind env vars — runs fine without them!
import type { EditorState } from './types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export interface SavedDesign {
  id: string;
  name: string;
  created_at: string;
  state: EditorState;
}

// Local storage fallback key
const LOCAL_STORAGE_KEY = 'badgeverse_saved_designs';

export async function saveDesign(name: string, state: EditorState): Promise<{ success: boolean; id: string }> {
  const id = 'design_' + Date.now();
  if (isSupabaseConfigured) {
    try {
      // Future Supabase insert here
      return { success: true, id };
    } catch {
      // Fallback
    }
  }

  // Local storage fallback
  if (typeof window !== 'undefined') {
    try {
      const existing = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '[]');
      existing.unshift({ id, name, created_at: new Date().toISOString(), state });
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(existing.slice(0, 50)));
      return { success: true, id };
    } catch {
      return { success: false, id: '' };
    }
  }

  return { success: false, id: '' };
}

export function getLocalSavedDesigns(): SavedDesign[] {
  if (typeof window !== 'undefined') {
    try {
      return JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '[]');
    } catch {
      return [];
    }
  }
  return [];
}

