import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MovieService } from '../services/movie.service';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { WishlistService } from '../services/wishlist.service';
import { Movie } from '../models/movie.model';
import { Auth, authState } from '@angular/fire/auth';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-movie-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './movie-detail.component.html',
  styleUrls: ['./movie-detail.component.scss'],
})
export class MovieDetailComponent implements OnInit, OnDestroy {
  movie!: Movie;
  videos: SafeResourceUrl[] = [];
  isWishlisted: boolean = false;
  isLoggedIn: boolean = false;
  private authSubscription?: Subscription;
  ottProviders: any[] = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private movieService: MovieService,
    private sanitizer: DomSanitizer,
    private wishlistService: WishlistService,
    private auth: Auth
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      const movieId = +id;

      // Get movie details first
      this.movieService.getMovieDetails(movieId).subscribe((data) => {
        this.movie = data as Movie;

        // Check wishlist status if user is already logged in
        if (this.isLoggedIn) {
          this.checkWishlistStatus();
        }
      });

      // Get movie videos
      this.movieService.getMovieVideos(movieId).subscribe((res: any) => {
        const trailers = res.results.filter(
          (video: any) => video.site === 'YouTube' && video.type === 'Trailer'
        );

        this.videos = trailers.map((video: any) =>
          this.sanitizer.bypassSecurityTrustResourceUrl(
            `https://www.youtube.com/embed/${video.key}`
          )
        );
      });

      // ✅ Fetch OTT providers using movieId (number)
      this.fetchWatchProviders(movieId);
    }

    // Listen to auth state changes
    this.authSubscription = authState(this.auth).subscribe((user) => {
      this.isLoggedIn = !!user;

      // Check wishlist status when auth state changes and we have movie data
      if (this.isLoggedIn && this.movie) {
        this.checkWishlistStatus();
      } else if (!this.isLoggedIn) {
        this.isWishlisted = false;
      }
    });
  }

  ngOnDestroy(): void {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

  private checkWishlistStatus(): void {
    if (this.movie) {
      this.wishlistService.isWishlisted(this.movie.id).subscribe({
        next: (isInList) => {
          this.isWishlisted = isInList;
        },
        error: (err) => {
          console.error('Error checking wishlist status:', err);
          this.isWishlisted = false;
        },
      });
    }
  }

  toggleWishlist(): void {
    if (!this.movie) {
      console.error('No movie data available');
      return;
    }

    if (!this.isLoggedIn) {
      alert('Please login to use the wishlist feature.');
      return;
    }

    if (this.isWishlisted) {
      this.wishlistService.removeFromWishlist(this.movie.id).subscribe({
        next: () => {
          this.isWishlisted = false;
          console.log('Movie removed from wishlist successfully');
        },
        error: (err) => {
          console.error('Failed to remove from wishlist:', err);
          alert('Failed to remove from wishlist. Please try again.');
        },
      });
    } else {
      this.wishlistService.addToWishlist(this.movie).subscribe({
        next: () => {
          this.isWishlisted = true;
          console.log('Movie added to wishlist successfully');
        },
        error: (err) => {
          console.error('Failed to add to wishlist:', err);
          alert('Failed to add to wishlist. Please try again.');
        },
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/home']);
  }

  fetchWatchProviders(movieId: number): void {
    this.movieService.getWatchProviders(movieId).subscribe((res: any) => {
      const indianProviders = res.results?.IN?.flatrate || [];
      this.ottProviders = indianProviders;
    });
  }
}
