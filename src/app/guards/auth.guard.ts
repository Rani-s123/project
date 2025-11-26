import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (_route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const wantsAdmin = state.url.includes('/admin');

  if (authService.isAuthenticated()) {
    if (wantsAdmin && !authService.isAdmin()) {
      router.navigate(['/login'], { queryParams: { redirectTo: state.url, reason: 'admin' } });
      return false;
    }
    return true;
  }

  router.navigate(['/login'], { queryParams: { redirectTo: state.url } });
  return false;
};
