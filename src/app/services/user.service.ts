import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  doc,
  setDoc,
  getDoc,
  docData,
} from '@angular/fire/firestore';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private firestore = inject(Firestore);
  private authService = inject(AuthService);

  async saveUsername(username: string) {
    const uid = this.authService.getCurrentUserId();
    if (!uid) return;

    const userDocRef = doc(this.firestore, `users/${uid}`);
    await setDoc(userDocRef, { username }, { merge: true });
  }

  async getUsername(): Promise<string | null> {
    const uid = this.authService.getCurrentUserId();
    if (!uid) return null;

    const userDocRef = doc(this.firestore, `users/${uid}`);
    const snapshot = await getDoc(userDocRef);
    return snapshot.exists() ? (snapshot.data() as any).username : null;
  }
}
