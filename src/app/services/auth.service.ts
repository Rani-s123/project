import { Injectable, computed, signal } from '@angular/core';

type Role = 'admin' | 'user';

interface Credentials {
  email: string;
  password: string;
  role: Role;
}

const ADMIN: Credentials = { email: 'admin@shop.dev', password: 'admin123', role: 'admin' };

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly _currentUser = signal<Credentials | null>(null);

  readonly currentUser = computed(() => this._currentUser());
  readonly isAuthenticated = computed(() => !!this._currentUser());
  readonly isAdmin = computed(() => this._currentUser()?.role === 'admin');

  login(email: string, password: string): boolean {
    const trimmedEmail = email.trim().toLowerCase();

    if (!trimmedEmail || !password) {
      this._currentUser.set(null);
      return false;
    }

    if (trimmedEmail === ADMIN.email && password === ADMIN.password) {
      this._currentUser.set({ ...ADMIN });
      return true;
    }

    // Accept any other credentials as a shopper account.
    this._currentUser.set({ email: trimmedEmail, password, role: 'user' });
    return true;
  }

  logout(): void {
    this._currentUser.set(null);
  }
}
