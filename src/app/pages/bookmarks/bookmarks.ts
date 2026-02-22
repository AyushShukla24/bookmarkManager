import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Bookmark, SupabaseService } from '../../services/supabase';

@Component({
  selector: 'app-bookmarks',
  standalone: true,
  imports: [CommonModule, FormsModule],
  styles: [`

    :host {
      font-family: 'DM Sans', sans-serif;
      color-scheme: dark;
    }

    * { box-sizing: border-box; margin: 0; padding: 0; }

    .app {
      min-height: 100vh;
      background: #080b12;
      color: #cbd5e1;
    }

    /* ── SIDEBAR ─────────────────────────────────── */
    .layout {
      display: flex;
      min-height: 100vh;
    }

    .sidebar {
      width: 260px;
      background: rgba(15,23,42,0.9);
      border-right: 1px solid rgba(255,255,255,0.05);
      display: flex;
      flex-direction: column;
      padding: 24px 16px;
      position: fixed;
      top: 0; left: 0; bottom: 0;
      z-index: 100;
      backdrop-filter: blur(20px);
      transition: transform 0.3s ease;
    }

    .sidebar-logo {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 8px 12px;
      margin-bottom: 32px;
    }

    .logo-icon {
      width: 32px; height: 32px;
      background: linear-gradient(135deg, #38bdf8, #818cf8);
      border-radius: 9px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
    }

    .logo-text {
      font-family: 'Syne', sans-serif;
      font-weight: 700;
      font-size: 17px;
      color: #f1f5f9;
    }

    .sidebar-section {
      font-size: 10px;
      font-weight: 600;
      letter-spacing: 1.2px;
      text-transform: uppercase;
      color: #334155;
      padding: 0 12px;
      margin-bottom: 8px;
      margin-top: 24px;
    }

    .tag-btn {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      padding: 8px 12px;
      border-radius: 10px;
      font-size: 13px;
      color: #64748b;
      cursor: pointer;
      border: none;
      background: transparent;
      width: 100%;
      text-align: left;
      transition: all 0.15s;
      font-family: 'DM Sans', sans-serif;
    }

    .tag-btn:hover { background: rgba(255,255,255,0.04); color: #94a3b8; }
    .tag-btn.active { background: rgba(56,189,248,0.1); color: #38bdf8; }

    .tag-btn-inner { display: flex; align-items: center; gap: 8px; }

    .tag-dot {
      width: 8px; height: 8px;
      border-radius: 50%;
      flex-shrink: 0;
    }

    .tag-count {
      font-size: 11px;
      background: rgba(255,255,255,0.06);
      padding: 2px 7px;
      border-radius: 100px;
      color: #475569;
    }

    .tag-btn.active .tag-count {
      background: rgba(56,189,248,0.15);
      color: #38bdf8;
    }

    .sidebar-footer {
      margin-top: auto;
      padding-top: 16px;
      border-top: 1px solid rgba(255,255,255,0.05);
    }

    .user-row {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 10px 12px;
      border-radius: 12px;
      background: rgba(255,255,255,0.03);
    }

    .user-avatar {
      width: 32px; height: 32px;
      border-radius: 50%;
      background: linear-gradient(135deg, #38bdf8, #818cf8);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 13px;
      font-weight: 700;
      color: white;
      flex-shrink: 0;
    }

    .user-info { flex: 1; min-width: 0; }
    .user-email {
      font-size: 12px;
      color: #475569;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .signout-btn {
      background: none;
      border: none;
      cursor: pointer;
      color: #334155;
      font-size: 16px;
      padding: 4px;
      border-radius: 6px;
      transition: all 0.15s;
      display: flex;
      align-items: center;
    }

    .signout-btn:hover { color: #ef4444; background: rgba(239,68,68,0.1); }

    /* ── MAIN CONTENT ─────────────────────────────── */
    .main {
      margin-left: 260px;
      padding: 32px;
      min-height: 100vh;
    }

    .topbar {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-bottom: 32px;
    }

    .search-wrap {
      flex: 1;
      position: relative;
      max-width: 480px;
    }

    .search-icon {
      position: absolute;
      left: 14px;
      top: 50%;
      transform: translateY(-50%);
      color: #334155;
      font-size: 15px;
    }

    .search-input {
      width: 100%;
      background: rgba(255,255,255,0.04);
      border: 1px solid rgba(255,255,255,0.07);
      border-radius: 12px;
      padding: 10px 16px 10px 40px;
      font-size: 14px;
      color: #cbd5e1;
      outline: none;
      font-family: 'DM Sans', sans-serif;
      transition: all 0.2s;
    }

    .search-input::placeholder { color: #334155; }
    .search-input:focus {
      border-color: rgba(56,189,248,0.3);
      background: rgba(56,189,248,0.04);
      box-shadow: 0 0 0 3px rgba(56,189,248,0.06);
    }

    .add-btn {
      display: flex;
      align-items: center;
      gap: 8px;
      background: linear-gradient(135deg, #38bdf8, #818cf8);
      color: white;
      border: none;
      border-radius: 12px;
      padding: 10px 20px;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      font-family: 'DM Sans', sans-serif;
      transition: all 0.2s;
      white-space: nowrap;
    }

    .add-btn:hover {
      transform: translateY(-1px);
      box-shadow: 0 8px 20px rgba(56,189,248,0.25);
    }

    /* Page title */
    .page-header {
      margin-bottom: 24px;
    }

    .page-title {
      font-family: 'Syne', sans-serif;
      font-size: 24px;
      font-weight: 700;
      color: #f1f5f9;
      letter-spacing: -0.5px;
    }

    .page-count {
      font-size: 13px;
      color: #334155;
      margin-top: 4px;
    }

    /* ── ADD FORM MODAL ───────────────────────────── */
    .modal-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.7);
      backdrop-filter: blur(8px);
      z-index: 200;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 24px;
      animation: fadeIn 0.2s ease;
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    .modal {
      background: #0f172a;
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 20px;
      padding: 32px;
      width: 100%;
      max-width: 480px;
      box-shadow: 0 32px 64px rgba(0,0,0,0.6);
      animation: modalIn 0.3s cubic-bezier(0.16,1,0.3,1);
    }

    @keyframes modalIn {
      from { opacity: 0; transform: scale(0.95) translateY(16px); }
      to { opacity: 1; transform: scale(1) translateY(0); }
    }

    .modal-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 24px;
    }

    .modal-title {
      font-family: 'Syne', sans-serif;
      font-size: 20px;
      font-weight: 700;
      color: #f1f5f9;
    }

    .modal-close {
      background: rgba(255,255,255,0.05);
      border: none;
      color: #475569;
      width: 32px; height: 32px;
      border-radius: 8px;
      cursor: pointer;
      font-size: 18px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.15s;
    }

    .modal-close:hover { background: rgba(239,68,68,0.1); color: #ef4444; }

    .form-field {
      margin-bottom: 16px;
    }

    .form-label {
      display: block;
      font-size: 12px;
      font-weight: 500;
      color: #475569;
      margin-bottom: 8px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .form-input {
      width: 100%;
      background: rgba(255,255,255,0.04);
      border: 1px solid rgba(255,255,255,0.07);
      border-radius: 12px;
      padding: 12px 16px;
      font-size: 14px;
      color: #cbd5e1;
      outline: none;
      font-family: 'DM Sans', sans-serif;
      transition: all 0.2s;
    }

    .form-input::placeholder { color: #334155; }

    .form-input:focus {
      border-color: rgba(56,189,248,0.4);
      background: rgba(56,189,248,0.04);
      box-shadow: 0 0 0 3px rgba(56,189,248,0.06);
    }

    .tag-select-row {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }

    .tag-pill {
      padding: 6px 14px;
      border-radius: 100px;
      font-size: 12px;
      font-weight: 500;
      cursor: pointer;
      border: 1px solid transparent;
      transition: all 0.15s;
      font-family: 'DM Sans', sans-serif;
    }

    .form-actions {
      display: flex;
      gap: 10px;
      margin-top: 24px;
    }

    .btn-cancel {
      flex: 1;
      padding: 12px;
      background: rgba(255,255,255,0.04);
      border: 1px solid rgba(255,255,255,0.07);
      border-radius: 12px;
      color: #475569;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      font-family: 'DM Sans', sans-serif;
      transition: all 0.15s;
    }

    .btn-cancel:hover { background: rgba(255,255,255,0.07); color: #94a3b8; }

    .btn-save {
      flex: 2;
      padding: 12px;
      background: linear-gradient(135deg, #38bdf8, #818cf8);
      border: none;
      border-radius: 12px;
      color: white;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      font-family: 'DM Sans', sans-serif;
      transition: all 0.2s;
    }

    .btn-save:hover { transform: translateY(-1px); box-shadow: 0 6px 16px rgba(56,189,248,0.25); }
    .btn-save:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }

    .error-msg {
      background: rgba(239,68,68,0.1);
      border: 1px solid rgba(239,68,68,0.15);
      border-radius: 10px;
      padding: 10px 14px;
      font-size: 13px;
      color: #f87171;
      margin-top: 12px;
    }

    /* ── BOOKMARK CARDS ───────────────────────────── */
    .bookmarks-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 16px;
    }

    .bookmark-card {
      background: rgba(15,23,42,0.7);
      border: 1px solid rgba(255,255,255,0.05);
      border-radius: 16px;
      padding: 20px;
      display: flex;
      flex-direction: column;
      gap: 14px;
      transition: all 0.2s;
      position: relative;
      overflow: hidden;
      animation: cardIn 0.4s ease both;
    }

    @keyframes cardIn {
      from { opacity: 0; transform: translateY(12px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .bookmark-card::before {
      content: '';
      position: absolute;
      top: 0; left: 0; right: 0;
      height: 1px;
      background: linear-gradient(90deg, transparent, rgba(56,189,248,0.2), transparent);
      opacity: 0;
      transition: opacity 0.2s;
    }

    .bookmark-card:hover {
      border-color: rgba(56,189,248,0.15);
      background: rgba(15,23,42,0.9);
      transform: translateY(-2px);
      box-shadow: 0 12px 32px rgba(0,0,0,0.3);
    }

    .bookmark-card:hover::before { opacity: 1; }

    .card-top {
      display: flex;
      align-items: flex-start;
      gap: 12px;
    }

    .favicon {
      width: 36px; height: 36px;
      border-radius: 10px;
      background: rgba(255,255,255,0.05);
      border: 1px solid rgba(255,255,255,0.07);
      flex-shrink: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
    }

    .favicon img {
      width: 20px; height: 20px;
      object-fit: contain;
    }

    .favicon-fallback { font-size: 16px; }

    .card-info { flex: 1; min-width: 0; }

    .card-title {
      font-size: 15px;
      font-weight: 500;
      color: #e2e8f0;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      margin-bottom: 4px;
      text-decoration: none;
      display: block;
      transition: color 0.15s;
    }

    .card-title:hover { color: #38bdf8; }

    .card-url {
      font-size: 12px;
      color: #334155;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .card-actions {
      display: flex;
      gap: 4px;
      opacity: 0;
      transition: opacity 0.2s;
      flex-shrink: 0;
    }

    .bookmark-card:hover .card-actions { opacity: 1; }

    .action-btn {
      width: 30px; height: 30px;
      border-radius: 8px;
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 13px;
      transition: all 0.15s;
      background: rgba(255,255,255,0.04);
      color: #475569;
    }

    .action-btn:hover { background: rgba(56,189,248,0.1); color: #38bdf8; }
    .action-btn.delete:hover { background: rgba(239,68,68,0.1); color: #ef4444; }

    .card-bottom {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .card-tag {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      padding: 3px 10px;
      border-radius: 100px;
      font-size: 11px;
      font-weight: 500;
    }

    .card-date {
      font-size: 11px;
      color: #1e293b;
    }

    .copied-toast {
      position: fixed;
      bottom: 24px;
      left: 50%;
      transform: translateX(-50%) translateY(0);
      background: #0f172a;
      border: 1px solid rgba(52,211,153,0.3);
      color: #34d399;
      padding: 10px 20px;
      border-radius: 100px;
      font-size: 13px;
      font-weight: 500;
      z-index: 300;
      animation: toastIn 0.3s ease;
      box-shadow: 0 8px 24px rgba(0,0,0,0.4);
    }

    @keyframes toastIn {
      from { opacity: 0; transform: translateX(-50%) translateY(16px); }
      to { opacity: 1; transform: translateX(-50%) translateY(0); }
    }

    /* Empty state */
    .empty-state {
      grid-column: 1 / -1;
      text-align: center;
      padding: 80px 24px;
    }

    .empty-icon {
      font-size: 48px;
      margin-bottom: 16px;
      filter: grayscale(1);
      opacity: 0.3;
    }

    .empty-title {
      font-family: 'Syne', sans-serif;
      font-size: 18px;
      font-weight: 600;
      color: #1e293b;
      margin-bottom: 8px;
    }

    .empty-sub { font-size: 14px; color: #1e293b; }

    /* Loading skeleton */
    .skeleton {
      background: linear-gradient(90deg, rgba(255,255,255,0.03) 25%, rgba(255,255,255,0.06) 50%, rgba(255,255,255,0.03) 75%);
      background-size: 200% 100%;
      animation: shimmer 1.5s infinite;
      border-radius: 8px;
    }

    @keyframes shimmer {
      0% { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }

    .skeleton-card {
      background: rgba(15,23,42,0.7);
      border: 1px solid rgba(255,255,255,0.05);
      border-radius: 16px;
      padding: 20px;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    /* Mobile hamburger */
    .hamburger {
      display: none;
      background: rgba(255,255,255,0.04);
      border: 1px solid rgba(255,255,255,0.07);
      border-radius: 10px;
      color: #64748b;
      width: 38px; height: 38px;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      font-size: 18px;
    }

    .sidebar-backdrop {
      display: none;
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.6);
      z-index: 99;
    }

    /* ── RESPONSIVE ───────────────────────────────── */
    @media (max-width: 900px) {
      .sidebar {
        transform: translateX(-100%);
      }
      .sidebar.open {
        transform: translateX(0);
      }
      .sidebar-backdrop { display: block; }
      .main { margin-left: 0; padding: 20px 16px; }
      .hamburger { display: flex; }
      .bookmarks-grid { grid-template-columns: 1fr; }
      .topbar { flex-wrap: wrap; }
      .search-wrap { order: 3; flex: 1 1 100%; max-width: 100%; }
    }

    @media (max-width: 480px) {
      .main { padding: 16px 12px; }
      .modal { padding: 24px 20px; }
    }
  `],
  template: `
    <div class="app">
      <!-- Sidebar backdrop for mobile -->
      @if (sidebarOpen) {
        <div class="sidebar-backdrop" (click)="sidebarOpen = false"></div>
      }

      <div class="layout">
        <!-- Sidebar -->
        <aside class="sidebar" [class.open]="sidebarOpen">
          <div class="sidebar-logo">
            <div class="logo-icon">📌</div>
            <span class="logo-text">Markify</span>
          </div>

          <div class="sidebar-section">Library</div>

          <button class="tag-btn" [class.active]="selectedTag === 'all'" (click)="selectTag('all'); sidebarOpen=false">
            <span class="tag-btn-inner">
              <span>🔖</span> All Bookmarks
            </span>
            <span class="tag-count">{{ bookmarks.length }}</span>
          </button>

          <div class="sidebar-section" style="margin-top:20px">Categories</div>

          @for (tag of availableTags; track tag.name) {
            <button class="tag-btn" [class.active]="selectedTag === tag.name"
              (click)="selectTag(tag.name); sidebarOpen=false">
              <span class="tag-btn-inner">
                <span class="tag-dot" [style.background]="tag.color"></span>
                {{ tag.name }}
              </span>
              <span class="tag-count">{{ countByTag(tag.name) }}</span>
            </button>
          }

          <div class="sidebar-footer">
            <div class="user-row">
              <div class="user-avatar">{{ userInitial }}</div>
              <div class="user-info">
                <div class="user-email">{{ userEmail }}</div>
              </div>
              <button class="signout-btn" (click)="signOut()" title="Sign out">⎋</button>
            </div>
          </div>
        </aside>

        <!-- Main -->
        <main class="main">
          <div class="topbar">
            <button class="hamburger" (click)="sidebarOpen = !sidebarOpen">☰</button>

            <div class="search-wrap">
              <span class="search-icon">🔍</span>
              <input
                class="search-input"
                [(ngModel)]="searchQuery"
                placeholder="Search bookmarks..."
              />
            </div>

            <button class="add-btn" (click)="showModal = true">
              <span>+</span> Add Bookmark
            </button>
          </div>

          <div class="page-header">
            <h1 class="page-title">
              {{ selectedTag === 'all' ? 'All Bookmarks' : selectedTag }}
            </h1>
            <p class="page-count">{{ filteredBookmarks.length }} bookmark{{ filteredBookmarks.length !== 1 ? 's' : '' }}</p>
          </div>

          <!-- Loading skeletons -->
          @if (fetching) {
            <div class="bookmarks-grid">
              @for (i of [1,2,3,4,5,6]; track i) {
                <div class="skeleton-card">
                  <div class="skeleton" style="height:20px;width:70%"></div>
                  <div class="skeleton" style="height:14px;width:90%"></div>
                  <div class="skeleton" style="height:12px;width:40%"></div>
                </div>
              }
            </div>

          } @else if (filteredBookmarks.length === 0) {
            <div class="bookmarks-grid">
              <div class="empty-state">
                <div class="empty-icon">🔖</div>
                <div class="empty-title">
                  {{ searchQuery ? 'No results found' : 'No bookmarks yet' }}
                </div>
                <p class="empty-sub">
                  {{ searchQuery ? 'Try a different search term' : 'Click "Add Bookmark" to save your first link' }}
                </p>
              </div>
            </div>

          } @else {
            <div class="bookmarks-grid">
              @for (bookmark of filteredBookmarks; track bookmark.id) {
                <div class="bookmark-card">
                  <div class="card-top">
                    <div class="favicon">
                      <img
                        [src]="getFavicon(bookmark.url)"
                        [alt]="bookmark.title"
                        (error)="onFaviconError($event)"
                      />
                    </div>
                    <div class="card-info">
                      <a class="card-title" [href]="bookmark.url" target="_blank" rel="noopener noreferrer">
                        {{ bookmark.title }}
                      </a>
                      <div class="card-url">{{ bookmark.url }}</div>
                    </div>
                    <div class="card-actions">
                      <button class="action-btn" (click)="copyUrl(bookmark.url)" title="Copy URL">📋</button>
                      <button class="action-btn delete" (click)="deleteBookmark(bookmark.id)" title="Delete">🗑</button>
                    </div>
                  </div>
                  <div class="card-bottom">
                    @if (bookmark.tag) {
                      <span class="card-tag" [style.background]="getTagBg(bookmark.tag)" [style.color]="getTagColor(bookmark.tag)">
                        <span class="tag-dot" [style.background]="getTagColor(bookmark.tag)"></span>
                        {{ bookmark.tag }}
                      </span>
                    } @else {
                      <span></span>
                    }
                    <span class="card-date">{{ formatDate(bookmark.created_at) }}</span>
                  </div>
                </div>
              }
            </div>
          }
        </main>
      </div>

      <!-- Add Bookmark Modal -->
      @if (showModal) {
        <div class="modal-overlay" (click)="closeModal($event)">
          <div class="modal">
            <div class="modal-header">
              <h2 class="modal-title">Add Bookmark</h2>
              <button class="modal-close" (click)="showModal = false">✕</button>
            </div>

            <div class="form-field">
              <label class="form-label">Title</label>
              <input
                class="form-input"
                [(ngModel)]="newTitle"
                placeholder="e.g. Angular Documentation"
                autofocus
              />
            </div>

            <div class="form-field">
              <label class="form-label">URL</label>
              <input
                class="form-input"
                [(ngModel)]="newUrl"
                placeholder="https://..."
              />
            </div>

            <div class="form-field">
              <label class="form-label">Category (optional)</label>
              <div class="tag-select-row">
                @for (tag of availableTags; track tag.name) {
                  <button
                    class="tag-pill"
                    [style.background]="newTag === tag.name ? getTagBg(tag.name) : 'rgba(255,255,255,0.04)'"
                    [style.color]="newTag === tag.name ? getTagColor(tag.name) : '#475569'"
                    [style.borderColor]="newTag === tag.name ? getTagColor(tag.name) : 'rgba(255,255,255,0.07)'"
                    (click)="newTag = newTag === tag.name ? '' : tag.name"
                  >
                    {{ tag.name }}
                  </button>
                }
              </div>
            </div>

            @if (formError) {
              <div class="error-msg">{{ formError }}</div>
            }

            <div class="form-actions">
              <button class="btn-cancel" (click)="showModal = false">Cancel</button>
              <button class="btn-save" (click)="addBookmark()" [disabled]="loading">
                {{ loading ? 'Saving...' : 'Save Bookmark' }}
              </button>
            </div>
          </div>
        </div>
      }

      <!-- Copy toast -->
      @if (showCopied) {
        <div class="copied-toast">✓ URL copied to clipboard</div>
      }
    </div>
  `,
})
export class BookmarksComponent implements OnInit, OnDestroy {
  bookmarks: Bookmark[] = [];
  newTitle = '';
  newUrl = '';
  newTag = '';
  loading = false;
  fetching = true;
  formError = '';
  userEmail = '';
  userInitial = '';
  searchQuery = '';
  selectedTag = 'all';
  showModal = false;
  showCopied = false;
  sidebarOpen = false;

  availableTags = [
    { name: 'Work',      color: '#38bdf8', bg: 'rgba(56,189,248,0.1)'  },
    { name: 'Design',    color: '#a78bfa', bg: 'rgba(167,139,250,0.1)' },
    { name: 'Dev',       color: '#34d399', bg: 'rgba(52,211,153,0.1)'  },
    { name: 'Learning',  color: '#fbbf24', bg: 'rgba(251,191,36,0.1)'  },
    { name: 'Personal',  color: '#f87171', bg: 'rgba(248,113,113,0.1)' },
  ];

  private realtimeChannel: any;

  constructor(private supabase: SupabaseService, private router: Router) {}

  async ngOnInit() {
    this.supabase.user$.subscribe(async user => {
      if (!user) { this.router.navigate(['/login']); return; }
      this.userEmail = user.email ?? '';
      this.userInitial = (user.email ?? 'U')[0].toUpperCase();
      await this.loadBookmarks();
      this.realtimeChannel = this.supabase.subscribeToBookmarks(user.id, () => this.loadBookmarks());
    });
  }

  ngOnDestroy() {
    if (this.realtimeChannel) this.realtimeChannel.unsubscribe();
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

  get filteredBookmarks(): Bookmark[] {
    return this.bookmarks.filter(b => {
      const matchTag = this.selectedTag === 'all' || (b as any).tag === this.selectedTag;
      const q = this.searchQuery.toLowerCase();
      const matchSearch = !q || b.title.toLowerCase().includes(q) || b.url.toLowerCase().includes(q);
      return matchTag && matchSearch;
    });
  }

  selectTag(tag: string) { this.selectedTag = tag; }

  countByTag(tag: string): number {
    return this.bookmarks.filter(b => (b as any).tag === tag).length;
  }

  getTagColor(tagName: string): string {
    return this.availableTags.find(t => t.name === tagName)?.color ?? '#64748b';
  }

  getTagBg(tagName: string): string {
    return this.availableTags.find(t => t.name === tagName)?.bg ?? 'rgba(255,255,255,0.05)';
  }

  getFavicon(url: string): string {
    try {
      const domain = new URL(url).hostname;
      return `https://www.google.com/s2/favicons?domain=${domain}&sz=32`;
    } catch { return ''; }
  }

  onFaviconError(event: any) {
    event.target.style.display = 'none';
    event.target.parentElement.innerHTML = '<span class="favicon-fallback">🔗</span>';
  }

  async copyUrl(url: string) {
    await navigator.clipboard.writeText(url);
    this.showCopied = true;
    setTimeout(() => this.showCopied = false, 2000);
  }

  formatDate(dateStr: string): string {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }

  closeModal(event: MouseEvent) {
    if ((event.target as HTMLElement).classList.contains('modal-overlay')) {
      this.showModal = false;
    }
  }

  async addBookmark() {
    this.formError = '';
    if (!this.newTitle.trim() || !this.newUrl.trim()) {
      this.formError = 'Both title and URL are required.';
      return;
    }
    try { new URL(this.newUrl); } catch {
      this.formError = 'Please enter a valid URL including https://';
      return;
    }
    this.loading = true;
    try {
      await this.supabase.addBookmark(this.newUrl.trim(), this.newTitle.trim(), this.newTag);
      this.newTitle = ''; this.newUrl = ''; this.newTag = '';
      this.showModal = false;
    } catch (e: any) {
      this.formError = e.message;
    } finally {
      this.loading = false;
    }
  }

  async deleteBookmark(id: string) {
    try { await this.supabase.deleteBookmark(id); }
    catch (e) { console.error(e); }
  }

  async signOut() {
    await this.supabase.signOut();
    this.router.navigate(['/login']);
  }
}