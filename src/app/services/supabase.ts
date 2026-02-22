import { Injectable } from '@angular/core';
import { createClient, SupabaseClient, User } from '@supabase/supabase-js';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../../enviroment';

export interface Bookmark {
  id: string;
  user_id: string;
  url: string;
  title: string;
  created_at: string;
}

@Injectable({ providedIn: 'root' })
export class SupabaseService {
  private supabase: SupabaseClient;
  
  // Reactive user state
  private userSubject = new BehaviorSubject<User | null>(null);
  user$ = this.userSubject.asObservable();

  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);

    // Listen for auth state changes (login, logout, token refresh)
    this.supabase.auth.onAuthStateChange((event, session) => {
      this.userSubject.next(session?.user ?? null);
    });

    // Load existing session on startup
    this.supabase.auth.getSession().then(({ data }) => {
      this.userSubject.next(data.session?.user ?? null);
    });
  }

  // ─── AUTH ───────────────────────────────────────────────
signInWithGoogle() {
  return this.supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: 'https://bookmark-manager-eight-coral.vercel.app' },
  });
}

  signOut() {
    return this.supabase.auth.signOut();
  }

  // ─── BOOKMARKS ──────────────────────────────────────────
  async getBookmarks(): Promise<Bookmark[]> {
    const { data, error } = await this.supabase
      .from('bookmarks')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data ?? [];
  }

  async addBookmark(url: string, title: string) {
    const user = this.userSubject.value;
    if (!user) throw new Error('Not authenticated');

    const { error } = await this.supabase
      .from('bookmarks')
      .insert({ url, title, user_id: user.id });

    if (error) throw error;
  }

  async deleteBookmark(id: string) {
    const { error } = await this.supabase
      .from('bookmarks')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  // ─── REALTIME ────────────────────────────────────────────
  // Returns a subscription — call .unsubscribe() on cleanup
  subscribeToBookmarks(userId: string, onChange: () => void) {
    return this.supabase
      .channel('bookmarks-channel')
      .on(
        'postgres_changes',
        {
          event: '*',            // INSERT, UPDATE, DELETE
          schema: 'public',
          table: 'bookmarks',
          filter: `user_id=eq.${userId}`,
        },
        () => onChange()         // Just re-fetch on any change
      )
      .subscribe();
  }
}