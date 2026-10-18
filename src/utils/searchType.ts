import type { SearchType } from "../types/SearchType";

export const SEARCH_TYPES: SearchType[] = ["movie", "tv", "person"];

export const SEARCH_TYPE_LABELS: Record<SearchType, string> = {
  movie: "Filmes",
  tv: "Séries",
  person: "Atores",
};

/** Converte um valor da URL em SearchType válido, usando "movie" como padrão. */
export function parseSearchType(value: string | null | undefined): SearchType {
  return SEARCH_TYPES.includes(value as SearchType) ? (value as SearchType) : "movie";
}
