export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  release_date: string;
  vote_average: number;
  genres?: { id: number; name: string }[];
  runtime?: number;
  [key: string]: any; // Optional: allows extra TMDB properties
}
