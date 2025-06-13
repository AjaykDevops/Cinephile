import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { WishlistService } from '../services/wishlist.service';
import { Movie } from '../models/movie.model';
import { Auth, authState } from '@angular/fire/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.scss'],
})
export class WishlistComponent implements OnInit {
  wishlist$!: Observable<Movie[]>;
  isLoggedIn$!: Observable<boolean>;
  error: string | null = null;

  constructor(
    private wishlistService: WishlistService,
    private auth: Auth,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Check if user is logged in
    this.isLoggedIn$ = authState(this.auth).pipe(map((user) => !!user));

    // Get wishlist with error handling
    this.wishlist$ = this.wishlistService.getWishlist().pipe(
      catchError((error) => {
        console.error('Error loading wishlist:', error);
        this.error = 'Failed to load wishlist. Please try again.';
        return of([]);
      })
    );
  }
  goToDetails(movieId: number): void {
    this.router.navigate(['/movie', movieId]);
  }
  removeFromWishlist(movieId: number): void {
    this.wishlistService.removeFromWishlist(movieId).subscribe({
      next: () => {
        console.log('Movie removed from wishlist');
        // Refresh the wishlist
        this.ngOnInit();
      },
      error: (err) => {
        console.error('Failed to remove from wishlist:', err);
        this.error = 'Failed to remove movie from wishlist.';
      },
    });
  }

  clearError(): void {
    this.error = null;
  }
  goBack() {
    this.router.navigate(['/home']);
  }
}
