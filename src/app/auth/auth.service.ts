// src/app/auth/auth.service.ts
import { Injectable, inject } from '@angular/core';
import {
  Auth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  createUserWithEmailAndPassword,
  User,
  GoogleAuthProvider,
  signInWithPopup,
} from '@angular/fire/auth';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private auth = inject(Auth); // ✅ Use Angular DI instead of getAuth()
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  constructor() {
    onAuthStateChanged(this.auth, (user) => {
      this.currentUserSubject.next(user);
    });
  }

  googleLogin() {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(this.auth, provider);
  }
  login(email: string, password: string) {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  register(email: string, password: string) {
    return createUserWithEmailAndPassword(this.auth, email, password);
  }

  logout() {
    return signOut(this.auth);
  }

  getCurrentUser() {
    return this.auth.currentUser;
  }
  getCurrentUserId(): string | undefined {
    return this.currentUserSubject.value?.uid;
  }
  async refreshUser() {
    const user = this.auth.currentUser;
    if (user) {
      await user.reload(); // 🔄 Fetch latest info
      this.currentUserSubject.next(user); // 🔁 Update observable
    }
  }
}
