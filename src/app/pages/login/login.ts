import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SupabaseService } from '../../services/supabase';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gray-50">
      <div class="bg-white p-10 rounded-2xl shadow-lg text-center max-w-md w-full">
        <h1 class="text-3xl font-bold text-gray-800 mb-2">📌 Bookmark Manager</h1>
        <p class="text-gray-500 mb-8">Save and organize your links in one place.</p>

        <button
          (click)="loginWithGoogle()"
          class="w-full flex items-center justify-center gap-3 bg-white border-2 border-gray-200 
                 text-gray-700 font-semibold py-3 px-6 rounded-xl hover:bg-gray-50 
                 hover:border-blue-400 transition-all duration-200 shadow-sm"
        >
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" 
               class="w-5 h-5" alt="Google" />
          Continue with Google
        </button>

        @if (error) {
          <p class="mt-4 text-red-500 text-sm">{{ error }}</p>
        }
      </div>
    </div>
  `,
})
export class LoginComponent {
  error = '';

  constructor(private supabase: SupabaseService, private router: Router) {
    // If already logged in, redirect
    this.supabase.user$.subscribe(user => {
      if (user) this.router.navigate(['/bookmarks']);
    });
  }

  async loginWithGoogle() {
    try {
      await this.supabase.signInWithGoogle();
    } catch (e: any) {
      this.error = e.message;
    }
  }
}