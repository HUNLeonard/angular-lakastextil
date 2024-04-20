// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user$: Observable<firebase.default.User | null>;

  constructor(private auth: AngularFireAuth) {
    this.user$ = this.auth.authState;
  }

  getCurrentUserId(): Observable<string | null> {
    return this.user$.pipe(
      map(user => user?.uid || null)
    );
  }

  getCurrentUser(): Observable<firebase.default.User | null> {
    return this.user$;
  }

  isLoggedIn(): Observable<boolean> {
    return this.user$.pipe(
      map(user => !!user)
    );
  }

  signOut(): Promise<void> {
    return this.auth.signOut();
  }
}