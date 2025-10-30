// src/types/Movie.ts

export interface MovieSearchResult {
    id: number;
    title: string;
    poster_path: string | null;
    release_date?: string;
  }
  
  export interface MovieDetails {
    title: string;
    type: string;
    director: string;
    budget: number | null;
    location: string;
    duration: string;
    year: number | null;
    posterUrl: string;
  }
  