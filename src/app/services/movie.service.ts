import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MovieService {
  private baseUrl = 'https://api.themoviedb.org/3';

  constructor(private http: HttpClient) {}

  getPopularMovies(region: string = 'IN') {
    return this.http.get(
      `${this.baseUrl}/movie/popular?api_key=${environment.tmdbApiKey}&region=${region}`
    );
  }

  getUpcomingMovies(region: string = 'IN') {
    return this.http.get(
      `${this.baseUrl}/movie/upcoming?api_key=${environment.tmdbApiKey}&region=${region}`
    );
  }

  getTopRatedMovies(region: string = 'IN') {
    return this.http.get(
      `${this.baseUrl}/movie/top_rated?api_key=${environment.tmdbApiKey}&region=${region}`
    );
  }

  getMovieVideos(movieId: number) {
    return this.http.get(
      `${this.baseUrl}/movie/${movieId}/videos?api_key=${environment.tmdbApiKey}`
    );
  }

  // Search Movies
  searchMovies(query: string) {
    return this.http.get(
      `${this.baseUrl}/search/movie?api_key=${environment.tmdbApiKey}&query=${query}`
    );
  }

  // Movie Details by ID
  getMovieDetails(id: number) {
    return this.http.get(
      `${this.baseUrl}/movie/${id}?api_key=${environment.tmdbApiKey}`
    );
  }

  // Get Genres
  getGenres() {
    return this.http.get(
      `${this.baseUrl}/genre/movie/list?api_key=${environment.tmdbApiKey}`
    );
  }

  // Get Languages
  getLanguages() {
    return this.http.get(
      `${this.baseUrl}/configuration/languages?api_key=${environment.tmdbApiKey}`
    );
  }

  // Get movies filtered by original language and genre
  getFilteredMovies(originalLanguage?: string, genreId?: string) {
    let url = `${this.baseUrl}/discover/movie?api_key=${environment.tmdbApiKey}`;

    if (originalLanguage) {
      url += `&with_original_language=${originalLanguage}`;
    }

    if (genreId) {
      url += `&with_genres=${genreId}`;
    }

    return this.http.get(url);
  }

  // Get Watch Providers (OTT platforms) for a movie
  getWatchProviders(movieId: number) {
    return this.http.get(
      `${this.baseUrl}/movie/${movieId}/watch/providers?api_key=${environment.tmdbApiKey}`
    );
  }
}
