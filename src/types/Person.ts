export interface Person {
  name: string;
  birthday: string | null;
  deathday: string | null;
  place_of_birth: string | null;
  biography: string;
  profile_path: string | null;
}

export interface PersonSearchResult {
  id: number;
  name: string;
  profile_path: string | null;
}

export interface PersonMovieCredit {
  id: number;
  title: string;
  original_title: string;
  release_date: string | null;
  character: string;
}

export interface PersonTvCredit {
  id: number;
  name: string;
  original_name: string;
  first_air_date: string | null;
  character: string;
  episode_count?: number;
}

export interface PersonImage {
  file_path: string;
}
