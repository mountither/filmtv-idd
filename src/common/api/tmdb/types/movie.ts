import type { ReviewsTypes } from "@/common/api/tmdb/types/reviews";
import type { MovieCreditsTypes } from "./movieCredits";


interface MovieMetaTypes {
  page: number;
  results: MovieTypes[];
  total_results: number;
  total_pages: number;
}

export interface MovieTypes {
  adult?: boolean;
  backdrop_path?: string;
  budget?: number;
  genres?: Genre[];
  homepage?: string;
  id?: number;
  imdb_id?: string;
  original_language?: string;
  original_title?: string;
  overview?: string;
  popularity?: number;
  poster_path?: string;
  production_companies?: ProductionCompany[];
  production_countries?: ProductionCountry[];
  release_date?: string;
  revenue?: number;
  runtime?: number;
  spoken_languages?: SpokenLanguage[];
  status?: string;
  tagline?: string;
  reviews?: ReviewsTypes;
  credits?: MovieCreditsTypes;
  recommendations?: MovieMetaTypes;
  title?: string;
  video?: boolean;
  vote_average?: number;
  vote_count?: number;
}

export interface Genre {
  id?: number;
  name?: string;
}

export interface ProductionCompany {
  id?: number;
  logo_path?: null | string;
  name?: string;
  origin_country?: string;
}

export interface ProductionCountry {
  iso_3166_1?: string;
  name?: string;
}

export interface SpokenLanguage {
  iso_639_1?: string;
  name?: string;
}
