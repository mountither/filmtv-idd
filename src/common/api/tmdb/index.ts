import type { MediaTypes } from "@/modules/media/types";
import axios from "axios";

export const IMAGE_BASE_URL_92 = "https://image.tmdb.org/t/p/w92";
export const IMAGE_BASE_URL_500 = "https://image.tmdb.org/t/p/w500";
export const IMAGE_BASE_URL_OG = "https://image.tmdb.org/t/p/original";

const TMDB_API = import.meta.env.VITE_TMDB_API;

const BASE_TMDB_URL = "https://api.themoviedb.org/3";

type FetchTrendingMediaProps = {
  mediaType: MediaTypes;
  window: "day" | "week";
};

export const fetchTrendingMedia = async ({
  mediaType,
  window,
}: FetchTrendingMediaProps) => {
  try {
    const url = `${BASE_TMDB_URL}/trending/${mediaType}/${window}?api_key=${TMDB_API}`;
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

type DiscoverMediaProps = {
  mediaType: MediaTypes;
  query: string;
  page?: number;
};

export const discoverMedia = async ({
  mediaType,
  query,
  page = 1,
}: DiscoverMediaProps) => {
  try {
    const url = `${BASE_TMDB_URL}/discover/${mediaType}?${query}&page=${page}&include_adult=false&api_key=${TMDB_API}`;
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const fetchMoviesInTheatre = async () => {
  try {
    const url = `${BASE_TMDB_URL}/movie/now_playing?region=AU&api_key=${TMDB_API}`;
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

type FetchSearchMultiResultsProps = {
  query: string;
  page: number;
};
export const fetchSearchMultiResults = async ({
  query,
  page,
}: FetchSearchMultiResultsProps) => {
  try {
    const url = `${BASE_TMDB_URL}/search/multi?query=${query}&include_adult=false&page=${page}&api_key=${TMDB_API}`;
    const response = await axios.get(url);
    //* exlude 'person' value from mediaType key - only tv + movie
    const filteredResult = response.data.results.filter((obj: any) => {
      return obj.media_type !== "person";
    });

    return {
      data: filteredResult,
      page: response.data.page,
      total_pages: response.data.total_pages,
      total_results: response.data.total_results,
    };
  } catch (error) {
    console.log(error);
  }
};

type FetchMediaWithIDProps = {
  id: string;
  type: MediaTypes;
  appendResponses: boolean;
};

export const fetchMediaWithID = async ({
  id,
  type,
  appendResponses,
}: FetchMediaWithIDProps) => {
  try {
    const extraRequests: string = appendResponses
      ? `append_to_response=reviews,credits,recommendations${
          type === "movie" ? ",releases" : ""
        }`
      : "";

    const url = `${BASE_TMDB_URL}/${type}/${id}?api_key=${TMDB_API}&${extraRequests}`;
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

type FetchMediaReviewsProps = {
  id: string;
  type: MediaTypes;
};

export const fetchMediaReviews = async ({
  id,
  type,
}: FetchMediaReviewsProps) => {
  try {
    const url = `${BASE_TMDB_URL}/${type}/${id}/reviews?api_key=${TMDB_API}`;
    const response = await axios.get(url);

    return response.data;
  } catch (error) {
    console.log(error);
  }
};

type fetchMediaWatchProvidersProps = {
  id: number;
  type: MediaTypes;
};
export const fetchMediaWatchProviders = async ({
  id,
  type,
}: fetchMediaWatchProvidersProps) => {
  try {
    const url = `${BASE_TMDB_URL}/${type}/${id}/watch/providers?api_key=${TMDB_API}`;
    const response = await axios.get(url);

    return response.data;
  } catch (error) {
    console.log(error);
  }
};

type fetchWatchProvidersProps = {
  type: MediaTypes;
};
export const fetchWatchProviders = async ({
  type,
}: fetchWatchProvidersProps) => {
  try {
    const url = `${BASE_TMDB_URL}/watch/providers/${type}?watch_region=AU&api_key=${TMDB_API}`;
    const response = await axios.get(url);

    return response.data;
  } catch (error) {
    console.log(error);
  }
};

type fetchMediaGenresProps = {
  type: MediaTypes;
};
export const fetchMediaGenres = async ({ type }: fetchMediaGenresProps) => {
  try {
    const url = `${BASE_TMDB_URL}/genre/${type}/list?api_key=${TMDB_API}`;
    const response = await axios.get(url);

    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const fetchMediaLanguages = async () => {
  try {
    const url = `${BASE_TMDB_URL}/configuration/languages?api_key=${TMDB_API}`;
    const response = await axios.get(url);

    return response.data;
  } catch (error) {
    console.log(error);
  }
};
