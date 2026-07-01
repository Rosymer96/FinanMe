import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { AuthSession, AuthUser } from '../models/auth-user.model';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterPayload extends LoginCredentials {
  name: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly router = inject(Router);
  private readonly usersStorageKey = 'finanme.users';
  private readonly sessionStorageKey = 'finanme.session';

  private readonly currentUserSubject = new BehaviorSubject<AuthSession | null>(
    this.readSession(),
  );

  currentUser$ = this.currentUserSubject.asObservable();

  getCurrentUser(): AuthSession | null {
    return this.currentUserSubject.value;
  }

  isAuthenticated(): boolean {
    return this.currentUserSubject.value !== null;
  }

  register(payload: RegisterPayload): AuthSession {
    const normalizedEmail = payload.email.trim().toLowerCase();
    const users = this.readUsers();
    const existingUser = users.find((user) => user.email === normalizedEmail);

    if (existingUser) {
      throw new Error('Ya existe una cuenta con ese email.');
    }

    const newUser: AuthUser = {
      id: crypto.randomUUID(),
      name: payload.name.trim(),
      email: normalizedEmail,
      password: payload.password,
    };

    users.push(newUser);
    this.writeUsers(users);

    const session = this.toSession(newUser);
    this.setSession(session);

    return session;
  }

  login(credentials: LoginCredentials): AuthSession {
    const normalizedEmail = credentials.email.trim().toLowerCase();
    const users = this.readUsers();
    const user = users.find(
      (candidate) =>
        candidate.email === normalizedEmail &&
        candidate.password === credentials.password,
    );

    if (!user) {
      throw new Error('Credenciales incorrectas.');
    }

    const session = this.toSession(user);
    this.setSession(session);

    return session;
  }

  logout(): void {
    localStorage.removeItem(this.sessionStorageKey);
    this.currentUserSubject.next(null);
    this.router.navigate(['/auth/login']);
  }

  private setSession(session: AuthSession): void {
    localStorage.setItem(this.sessionStorageKey, JSON.stringify(session));
    this.currentUserSubject.next(session);
  }

  private readSession(): AuthSession | null {
    const session = localStorage.getItem(this.sessionStorageKey);
    return session ? (JSON.parse(session) as AuthSession) : null;
  }

  private readUsers(): AuthUser[] {
    const users = localStorage.getItem(this.usersStorageKey);
    return users ? (JSON.parse(users) as AuthUser[]) : [];
  }

  private writeUsers(users: AuthUser[]): void {
    localStorage.setItem(this.usersStorageKey, JSON.stringify(users));
  }

  private toSession(user: AuthUser): AuthSession {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
    };
  }
}
