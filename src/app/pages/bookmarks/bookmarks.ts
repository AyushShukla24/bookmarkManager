import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Bookmark, SupabaseService } from '../../services/supabase';

@Component({
  selector: 'app-bookmarks',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen bg-gray-50">
      <!-- Header -->
      <header class="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
        <h1 class="text-xl font-bold text-gray-800">📌 My Bookmarks</h1>
        <div class="flex items-center gap-3">
          <span class="text-sm text-gray-500">{{ userEmail }}</span>
          <button
            (click)="signOut()"
            class="text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 
                   px-4 py-2 rounded-lg transition-colors"
          >
            Sign Out
          </button>
        </div>
      </header>

      <main class="max-w-2xl mx-auto px-4 py-8">
        <!-- Add Bookmark Form -->
        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
          <h2 class="text-lg font-semibold text-gray-700 mb-4">Add New Bookmark</h2>
          <div class="flex flex-col gap-3">
            <input
              [(ngModel)]="newTitle"
              placeholder="Title (e.g. Angular Docs)"
              class="border border-gray-200 rounded-xl px-4 py-3 text-sm 
                     focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <input
              [(ngModel)]="newUrl"
              placeholder="URL (e.g. https://angular.dev)"
              class="border border-gray-200 rounded-xl px-4 py-3 text-sm 
                     focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button
              (click)="addBookmark()"
              [disabled]="loading"
              class="bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white 
                     font-semibold py-3 px-6 rounded-xl transition-colors self-end"
            >
              {{ loading ? 'Adding...' : 'Add Bookmark' }}
            </button>
          </div>
          @if (formError) {
            <p class="mt-3 text-red-500 text-sm">{{ formError }}</p>
          }
        </div>

        <!-- Bookmarks List -->
        @if (fetching) {
          <div class="text-center py-12 text-gray-400">Loading bookmarks...</div>
        } @else if (bookmarks.length === 0) {
          <div class="text-center py-12 text-gray-400">
            <p class="text-4xl mb-3">🔖</p>
            <p>No bookmarks yet. Add your first one above!</p>
          </div>
        } @else {
          <div class="flex flex-col gap-3">
            @for (bookmark of bookmarks; track bookmark.id) {
              <div class="bg-white rounded-xl border border-gray-100 shadow-sm 
                          px-5 py-4 flex items-center justify-between group">
                <div class="flex-1 min-w-0">
                  
                  <a  [href]="bookmark.url"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="font-medium text-blue-600 hover:underline block truncate"
                  >
                    {{ bookmark.title }}
                  </a>
                  <p class="text-xs text-gray-400 mt-1 truncate">{{ bookmark.url }}</p>
                </div>
                <button
                  (click)="deleteBookmark(bookmark.id)"
                  class="ml-4 text-gray-300 hover:text-red-500 transition-colors 
                         opacity-0 group-hover:opacity-100 text-lg"
                  title="Delete bookmark"
                >
                  🗑️
                </button>
              </div>
            }
          </div>
        }
      </main>
    </div>
  `,
})
export class BookmarksComponent implements OnInit, OnDestroy {
  bookmarks: Bookmark[] = [];
  newTitle = '';
  newUrl = '';
  loading = false;
  fetching = true;
  formError = '';
  userEmail = '';

  private realtimeChannel: any;

  constructor(private supabase: SupabaseService, private router: Router) {}

  async ngOnInit() {
    this.supabase.user$.subscribe(async user => {
      if (!user) {
        this.router.navigate(['/login']);
        return;
      }
      this.userEmail = user.email ?? '';
      await this.loadBookmarks();

      // Subscribe to realtime changes for this user
      this.realtimeChannel = this.supabase.subscribeToBookmarks(
        user.id,
        () => this.loadBookmarks()    // Re-fetch whenever DB changes
      );
    });
  }

  ngOnDestroy() {
    // Always clean up realtime subscriptions!
    if (this.realtimeChannel) {
      this.realtimeChannel.unsubscribe();
    }
  }

  async loadBookmarks() {
    try {
      this.bookmarks = await this.supabase.getBookmarks();
    } catch (e) {
      console.error(e);
    } finally {
      this.fetching = false;
    }
  }

  async addBookmark() {
    this.formError = '';
    if (!this.newTitle.trim() || !this.newUrl.trim()) {
      this.formError = 'Both title and URL are required.';
      return;
    }
    // Basic URL validation
    try { new URL(this.newUrl); } catch {
      this.formError = 'Please enter a valid URL including https://';
      return;
    }

    this.loading = true;
    try {
      await this.supabase.addBookmark(this.newUrl.trim(), this.newTitle.trim());
      this.newTitle = '';
      this.newUrl = '';
      // No need to manually refresh — realtime subscription handles it!
    } catch (e: any) {
      this.formError = e.message;
    } finally {
      this.loading = false;
    }
  }

  async deleteBookmark(id: string) {
    try {
      await this.supabase.deleteBookmark(id);
      // Again, realtime handles the UI update
    } catch (e) {
      console.error(e);
    }
  }

  async signOut() {
    await this.supabase.signOut();
    this.router.navigate(['/login']);
  }
}