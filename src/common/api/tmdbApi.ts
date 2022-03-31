import axios from "axios";

export const IMAGE_BASE_URL_92 = "https://image.tmdb.org/t/p/w92";
export const IMAGE_BASE_URL_500 = "https://image.tmdb.org/t/p/w500";
export const IMAGE_BASE_URL_OG = "https://image.tmdb.org/t/p/original";

const TMDB_API = import.meta.env.VITE_TMDB_API;

const BASE_TMDB_URL = "https://api.themoviedb.org/3";

type FetchTrendingMediaProps = {
  mediaType: "movie" | "tv";
  window: "day" | "week";
};

export const fetchTrendingMedia = async ({
  mediaType,
  window,
}: FetchTrendingMediaProps) => {
  try {
    const url = `${BASE_TMDB_URL}/trending/${mediaType}/${window}?api_key=${TMDB_API}`;
    const response = await axios.get(url);
    return response.data.results;
  } catch (error) {
    console.log(error);
  }
};

type DiscoverMediaProps = {
  mediaType: "movie" | "tv";
  query: string;
};

export const discoverMedia = async ({
  mediaType,
  query,
}: DiscoverMediaProps) => {
  try {
    const url = `${BASE_TMDB_URL}/discover/${mediaType}?${query}&api_key=${TMDB_API}`;
    const response = await axios.get(url);
    return response.data.results;
  } catch (error) {
    console.log(error);
  }
};

export const fetchMoviesInTheatre = async () => {
  try {
    const url = `${BASE_TMDB_URL}/movie/now_playing?region=AU&api_key=${TMDB_API}`;
    const response = await axios.get(url);
    return response.data.results;
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
    const url = `${BASE_TMDB_URL}/search/multi?query=${query}&page=${page}&api_key=${TMDB_API}`;
    const response = await axios.get(url);

    //* exlude 'person' value from mediaType key - only tv + movie
    const filteredResult = response.data.results.filter((obj: any) => {
      return obj.media_type !== "person";
    });

    console.log(filteredResult)
    return filteredResult;

  } catch (error) {
    if (axios.isCancel(error)) {
      console.log("Fetch Canceled @ TV search fetch");
    } else {
      console.log(error);
    }
  }
};
