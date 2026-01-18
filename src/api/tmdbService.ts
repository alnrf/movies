import { tmdbClient } from "./tmdbClient";
import { getBrowserLanguage } from "../utils/getBrowserLanguage";

const defaultParams = {
  language: getBrowserLanguage(),
  include_adult: false,
};
/* SEARCH */
export const getMovies = (query: string, page = 1) =>
  tmdbClient.get("/search/movie", {
    params: { query, ...defaultParams, page },
  });

export const getTvShows = (query: string, page = 1) =>
  tmdbClient.get("/search/tv", {
    params: { query, ...defaultParams, page },
  });

export const getPeople = (query: string, page = 1) =>
  tmdbClient.get("/search/person", {
    params: { query, ...defaultParams, page },
  });

/* DETAILS */
export const getMovieDetail = (id: number) =>
  tmdbClient.get(`/movie/${id}`, { params: { language: defaultParams.language } });

export const getTvShowDetail = (id: number) =>
  tmdbClient.get(`/tv/${id}`, { params: { language: defaultParams.language } });

/* CAST */
export const getMovieActors = (movieId: number) =>
  tmdbClient.get(`/movie/${movieId}/credits`, {
    params: { language: defaultParams.language },
  });
export const getTvActors = (tvId: number) =>
  tmdbClient.get(`/tv/${tvId}/credits`, {
    params: { language: defaultParams.language },
  });

/* ACTOR */
export const getActorDetail = (actorId: number) =>
  tmdbClient.get(`/person/${actorId}`, { params: { language: defaultParams.language } });

export const getActorMovies = (actorId: number) =>
  tmdbClient.get(`/person/${actorId}/movie_credits`, {
    params: { language: defaultParams.language },
  });
export const getActorTv = (actorId: number) =>
  tmdbClient.get(`/person/${actorId}/tv_credits`, {
    params: { language: defaultParams.language },
  });

  export const getCredits = (
  mediaType: "movie" | "tv",
  id: number
) => tmdbClient.get(`/${mediaType}/${id}/${mediaType === "movie" ? "credits" : "aggregate_credits"}`);

