import { tmdbClient } from "./tmdbClient";
import { TMDB_LANGUAGE } from "../config/tmdb";

const defaultParams = {
  language: TMDB_LANGUAGE,
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

/* LISTS */
export const getPopular = (type: "movie" | "tv" | "person", page = 1) =>
  tmdbClient.get(`/${type}/popular`, {
    params: { language: defaultParams.language, page },
  });

export const getUpcomingMovies = (page = 1) =>
  tmdbClient.get("/movie/upcoming", {
    params: { language: defaultParams.language, page },
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

export const getActorImages = (actorId: number) =>
  tmdbClient.get(`/person/${actorId}/images`);

export const getCredits = (mediaType: "movie" | "tv", id: number) =>
  tmdbClient.get(
    `/${mediaType}/${id}/${mediaType === "movie" ? "credits" : "aggregate_credits"}`,
    { params: { language: defaultParams.language } },
  );

/* SIMILAR */
export const getSimilar = (mediaType: "movie" | "tv", id: number, page = 1) =>
  tmdbClient.get(`/${mediaType}/${id}/similar`, {
    params: { language: defaultParams.language, page },
  });

/* IMAGES */
// Imagens em português e as sem idioma (cenas sem texto), que são a maioria.
export const getMediaImages = (mediaType: "movie" | "tv", id: number) =>
  tmdbClient.get(`/${mediaType}/${id}/images`, {
    params: { language: defaultParams.language, include_image_language: "pt,null" },
  });

/* WATCH PROVIDERS */
export const getMovieWatchProviders = (movieId: number) =>
  tmdbClient.get(`/movie/${movieId}/watch/providers`);

export const getTvWatchProviders = (tvId: number) =>
  tmdbClient.get(`/tv/${tvId}/watch/providers`);

/* SEASON & EPISODE */
export const getTvSeasonDetails = (tvId: number, seasonNumber: number) =>
  tmdbClient.get(`/tv/${tvId}/season/${seasonNumber}`, { params: { language: defaultParams.language } });

export const getTvEpisodeDetails = (tvId: number, seasonNumber: number, episodeNumber: number) =>
  tmdbClient.get(`/tv/${tvId}/season/${seasonNumber}/episode/${episodeNumber}`, { params: { language: defaultParams.language } });

