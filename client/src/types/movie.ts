export interface MovieSearchResult {
    id: number;
    title: string;
    poster_path?: string;
    release_date?: string;
  }
  
  export interface MovieDetails {
    title: string;
    type: "movie";
  
    director?: string;        
    budget?: number | null;  
    location?: string;        
    duration?: string | null; 
    year?: number | null;     
    posterUrl?: string;      
  }
  