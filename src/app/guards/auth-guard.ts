import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map, take } from 'rxjs/operators';
import { SupabaseService } from '../services/supabase';

export const authGuard: CanActivateFn = () => {
  const supabase = inject(SupabaseService);
  const router = inject(Router);

  return supabase.user$.pipe(
    take(1),
    map(user => user ? true : router.createUrlTree(['/login']))
  );
};