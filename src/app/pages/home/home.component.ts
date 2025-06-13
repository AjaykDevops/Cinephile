import {
  Component,
  OnInit,
  ElementRef,
  ViewChild,
  HostListener,
} from '@angular/core';
import { MovieService } from '../../services/movie.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { AuthService } from '../../auth/auth.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, NgSelectModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  @ViewChild('popularFilmstrip', { static: false })
  popularFilmstrip!: ElementRef;
  @ViewChild('upcomingFilmstrip', { static: false })
  upcomingFilmstrip!: ElementRef;
  @ViewChild('topRatedFilmstrip', { static: false })
  topRatedFilmstrip!: ElementRef;

  selectedRegion: string = 'IN';
  popularMovies: any[] = [];
  upcomingMovies: any[] = [];
  topRatedMovies: any[] = [];

  searchQuery: string = '';
  searchResults: any[] = [];
  genres: any[] = [];
  languages: any[] = [];

  selectedGenre: string | null = null;
  selectedLanguage: string | null = null;

  usernameInput: string = '';
  customUsername: string = '';
  customUsernameSet: boolean = false;
  isProfileCardOpen = false;
  editUsernameMode: boolean = false;

  constructor(
    public router: Router,
    private movieService: MovieService,
    private authService: AuthService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.getPopularMovies();
    this.getUpcomingMovies();
    this.getTopRatedMovies();
    this.getGenres();
    this.getLanguages();
    this.user$.subscribe((user) => {
      if (user) {
        this.loadUsernameFromFirestore();
      }
    });
  }

  get user$() {
    return this.authService.currentUser$;
  }

  async loadUsernameFromFirestore() {
    const username = await this.userService.getUsername();
    if (username) {
      this.customUsername = username;
      this.customUsernameSet = true;
    }
  }

  async setUsername() {
    if (this.usernameInput.trim()) {
      this.customUsername = this.usernameInput.trim();
      this.customUsernameSet = true;
      this.editUsernameMode = false;
      await this.userService.saveUsername(this.customUsername);
    }
  }

  enableUsernameEdit() {
    this.usernameInput = this.customUsername;
    this.editUsernameMode = true;
  }

  getPopularMovies() {
    this.movieService
      .getPopularMovies(this.selectedRegion)
      .subscribe((res: any) => {
        this.popularMovies = this.selectedGenre
          ? res.results.filter((movie: any) =>
              movie.genre_ids.includes(+this.selectedGenre!)
            )
          : res.results;
      });
  }

  getUpcomingMovies() {
    this.movieService
      .getUpcomingMovies(this.selectedRegion ?? 'IN')
      .subscribe((res: any) => {
        const today = new Date();
        this.upcomingMovies = res.results.filter((movie: any) => {
          const releaseDate = new Date(movie.release_date);
          return releaseDate > today;
        });
      });
  }

  getTopRatedMovies() {
    this.movieService
      .getTopRatedMovies(this.selectedRegion)
      .subscribe((res: any) => {
        this.topRatedMovies = res.results;
      });
  }

  getGenres() {
    this.movieService.getGenres().subscribe((res: any) => {
      this.genres = res.genres.sort((a: any, b: any) =>
        a.name.localeCompare(b.name)
      );
    });
  }

  getLanguages() {
    this.movieService.getLanguages().subscribe((res: any) => {
      this.languages = res.sort((a: any, b: any) =>
        a.english_name.localeCompare(b.english_name)
      );
    });
  }

  onSearch() {
    if (!this.searchQuery.trim()) {
      this.searchResults = [];
      return;
    }

    this.movieService.searchMovies(this.searchQuery).subscribe((res: any) => {
      this.searchResults = res.results;
    });
  }

  onFilterChange() {
    this.movieService
      .getFilteredMovies(
        this.selectedLanguage ?? undefined,
        this.selectedGenre ?? undefined
      )
      .subscribe((res: any) => {
        this.popularMovies = res.results;
      });
  }

  goToDetails(id: number) {
    this.router.navigate(['/movie', id]);
  }

  getImageUrl(posterPath: string): string {
    return posterPath
      ? `https://image.tmdb.org/t/p/w500${posterPath}`
      : 'assets/default-image.jpg';
  }

  scrollRight(section: 'popular' | 'upcoming' | 'topRated') {
    const container =
      section === 'popular'
        ? this.popularFilmstrip.nativeElement
        : section === 'upcoming'
        ? this.upcomingFilmstrip.nativeElement
        : this.topRatedFilmstrip.nativeElement;

    const scrollAmount = container.offsetWidth;
    container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  }

  scrollLeft(section: 'popular' | 'upcoming' | 'topRated') {
    const container =
      section === 'popular'
        ? this.popularFilmstrip.nativeElement
        : section === 'upcoming'
        ? this.upcomingFilmstrip.nativeElement
        : this.topRatedFilmstrip.nativeElement;

    const scrollAmount = container.offsetWidth;
    container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
  }

  goBack() {
    this.router.navigate(['/']);
  }

  logout() {
    this.customUsername = '';
    this.customUsernameSet = false;
    this.authService.logout().then(() => this.router.navigate(['/home']));
  }

  goToWishlist() {
    this.router.navigate(['/wishlist']);
  }

  toggleProfileCard() {
    this.isProfileCardOpen = !this.isProfileCardOpen;
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const clickedInside =
      target.closest('.user-profile-card') || target.closest('.profile-icon');
    if (!clickedInside) {
      this.isProfileCardOpen = false;
    }
  }
}
