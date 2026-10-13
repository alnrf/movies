import type { MovieSearchResult } from "./Movie";
import type { TvShowSearchResult } from "./TvShow";
import type { PersonSearchResult } from "./Person";

export type SearchResultItem =
  | MovieSearchResult
  | TvShowSearchResult
  | PersonSearchResult;
