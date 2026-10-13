import axios from "axios";
import { TMDB_CONFIG } from "../config/tmdb";

export const tmdbClient = axios.create({
  baseURL: TMDB_CONFIG.BASE_URL,
  headers: TMDB_CONFIG.HEADERS,
});
