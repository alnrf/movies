const BEARER_TOKEN = import.meta.env.VITE_TMDB_BEARER_TOKEN;

if (!BEARER_TOKEN) {
  throw new Error("VITE_TMDB_BEARER_TOKEN não definido no .env");
}

export const TMDB_CONFIG = {
  BASE_URL: "https://api.themoviedb.org/3",
  IMAGE_URL: "https://image.tmdb.org/t/p",
  HEADERS: {
    accept: "application/json",
    Authorization: `Bearer ${BEARER_TOKEN}`,
  },
  IMAGE_BASE_URL: "https://image.tmdb.org/t/p",
  POSTER_SIZES: {
    XSMALL: "w92",
    SMALL: "w200",
    MEDIUM: "w300",
    LARGE: "w500",
    ORIGINAL: "original",
  },
  BACKDROP_SIZES: {
    SMALL: "w300",
    MEDIUM: "w780",
    LARGE: "w500",
    ORIGINAL: "original",
  },
};
