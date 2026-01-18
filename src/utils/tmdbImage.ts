import { TMDB_CONFIG } from "../config/tmdb";
import unknownImage from "../assets/unknow.png";

export function getPosterUrl(
  path: string | null,
  size: keyof typeof TMDB_CONFIG.POSTER_SIZES = "MEDIUM"
) {
  if (!path) return unknownImage;

  return `${TMDB_CONFIG.IMAGE_BASE_URL}/${TMDB_CONFIG.POSTER_SIZES[size]}${path}`;
}

export function getProfileUrl(
  path: string | null,
  size: keyof typeof TMDB_CONFIG.POSTER_SIZES = "MEDIUM"
) {
  if (!path) return unknownImage;

  return `${TMDB_CONFIG.IMAGE_BASE_URL}/${TMDB_CONFIG.POSTER_SIZES[size]}${path}`;
}

export function getBackdropUrl(
  path: string | null,
  size: keyof typeof TMDB_CONFIG.BACKDROP_SIZES = "LARGE"
) {
  if (!path) return unknownImage;

  return `${TMDB_CONFIG.IMAGE_BASE_URL}/${TMDB_CONFIG.BACKDROP_SIZES[size]}${path}`;
}
