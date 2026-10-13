import type { Genre } from "./Common";

export interface MovieSearchResult {
  id: number;
  title: string;
  original_title: string;
  poster_path: string | null;
}

export interface MovieDetail {
  id: number;
  title: string;
  original_title: string;
  overview: string;
  backdrop_path: string | null;
  release_date: string | null;
  budget: number;
  revenue: number;
  genres: Genre[];
}
