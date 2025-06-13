import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  doc,
  setDoc,
  deleteDoc,
  getDoc,
} from '@angular/fire/firestore';
import { Auth, authState } from '@angular/fire/auth';
import { from, map, of, switchMap, Observable, throwError } from 'rxjs';
import { Movie } from '../models/movie.model';

@Injectable({
  providedIn: 'root',
})
export class WishlistService {
  private firestore = inject(Firestore);
  private auth = inject(Auth);

  private getCurrentUserId(): Observable<string> {
    return authState(this.auth).pipe(
      map((user) => {
        if (!user) {
          throw new Error('User not authenticated');
        }
        return user.uid;
      })
    );
  }

  private getUserWishlistCollection(uid: string) {
    return collection(this.firestore, `users/${uid}/wishlist`);
  }

  addToWishlist(movie: Movie): Observable<void> {
    return this.getCurrentUserId().pipe(
      switchMap((uid) => {
        const docRef = doc(this.firestore, `users/${uid}/wishlist/${movie.id}`);
        const movieData = {
          id: movie.id,
          title: movie.title,
          poster_path: movie.poster_path,
          overview: movie.overview,
          release_date: movie.release_date,
          vote_average: movie.vote_average,
          addedAt: new Date().toISOString(),
        };
        return from(setDoc(docRef, movieData));
      }),
      map(() => void 0)
    );
  }

  removeFromWishlist(movieId: number): Observable<void> {
    return this.getCurrentUserId().pipe(
      switchMap((uid) => {
        const docRef = doc(this.firestore, `users/${uid}/wishlist/${movieId}`);
        return from(deleteDoc(docRef));
      }),
      map(() => void 0)
    );
  }

  isWishlisted(movieId: number): Observable<boolean> {
    return this.getCurrentUserId().pipe(
      switchMap((uid) => {
        const docRef = doc(this.firestore, `users/${uid}/wishlist/${movieId}`);
        return from(getDoc(docRef));
      }),
      map((docSnap) => docSnap.exists())
    );
  }

  getWishlist(): Observable<Movie[]> {
    return this.getCurrentUserId().pipe(
      switchMap((uid) => {
        const wishlistCollection = this.getUserWishlistCollection(uid);
        return collectionData(wishlistCollection, {
          idField: 'id',
        }) as Observable<Movie[]>;
      })
    );
  }
}
