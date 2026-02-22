import { Routes } from '@angular/router';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
    //   import('./pages/login/login.component').then(m => m.LoginComponent),
      import('./pages/login/login').then(m => m.LoginComponent),
  },
  {
    path: 'bookmarks',
    loadComponent: () =>
      import('./pages/bookmarks/bookmarks').then(m => m.BookmarksComponent),
    canActivate: [authGuard],
  },
  { path: '', redirectTo: 'bookmarks', pathMatch: 'full' },
  { path: '**', redirectTo: 'bookmarks' },
];