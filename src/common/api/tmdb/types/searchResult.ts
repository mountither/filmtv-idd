export interface SearchDataTypes {
  page: number;
  results: SearchResult[];
  total_results: number;
  total_pages: number;
}

export interface SearchResult {
  poster_path?: null | string;
  popularity?: number;
  id?: number;
  overview?: string;
  backdrop_path?: null | string;
  vote_average?: number;
  media_type: MediaType;
  first_air_date?: string;
  origin_country?: string[];
  genre_ids?: number[];
  original_language?: string;
  vote_count?: number;
  name?: string;
  original_name?: string;
  adult?: boolean;
  release_date?: string;
  original_title?: string;
  title?: string;
  video?: boolean;
}

export enum MediaType {
  Movie = "movie",
  TV = "tv",
}
