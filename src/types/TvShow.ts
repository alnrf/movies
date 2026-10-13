import type { Genre } from "./Common";
import type { CastMember } from "./Cast";

export interface TvShowSearchResult {
  id: number;
  name: string;
  original_name: string;
  poster_path: string | null;
}

export interface TvShowDetail {
  id: number;
  name: string;
  original_name: string;
  overview: string;
  backdrop_path: string | null;
  first_air_date: string | null;
  last_air_date: string | null;
  next_episode_to_air: { air_date: string } | null;
  number_of_episodes: number;
  number_of_seasons: number;
  genres: Genre[];
}

export interface EpisodeSummary {
  id: number;
  name: string;
  episode_number: number;
  still_path: string | null;
  overview: string;
  air_date: string | null;
}

export interface SeasonDetail {
  poster_path: string | null;
  overview: string;
  episodes: EpisodeSummary[];
}

export interface EpisodeDetail {
  name: string;
  overview: string;
  air_date: string | null;
  guest_stars?: CastMember[];
}
