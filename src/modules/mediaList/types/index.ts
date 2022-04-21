import type { TVTypes } from "@/common/api/tmdb/types/tv";
import type { MovieTypes } from "@/common/api/tmdb/types/movie";
import type { SearchResult } from "@/common/api/tmdb/types/searchResult";

type MediaDataTypes = MovieTypes & TVTypes & SearchResult

export type MediaDataList = {
    data: MediaDataTypes[],
    totalResults: number | undefined,
    totalPages: number | undefined
}