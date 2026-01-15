import { useState } from "react";
import type { Cast } from "../types/Cast";
import { TMDB_CONFIG } from "../config/tmdb";
import type { Movie } from "../types/Movie";

interface MovieSearchProps {
  setMovie: React.Dispatch<React.SetStateAction<Movie | null>>;
  setCast: React.Dispatch<React.SetStateAction<Cast[]>>;
}

export default function MovieSearch({ setMovie, setCast }: MovieSearchProps) {
  const [query, setQuery] = useState<string>("");

  async function searchMovie(): Promise<void> {
    const searchUrl =
      `${TMDB_CONFIG.BASE_URL}/search/movie` +
      `?query=${encodeURIComponent(query)}&language=pt-BR`;

    const movieRes = await fetch(searchUrl, {
      headers: TMDB_CONFIG.HEADERS,
    });

    const movieData = await movieRes.json();
    const movie = movieData.results?.[0];

    if (!movie) return;

    const creditsRes = await fetch(
      `${TMDB_CONFIG.BASE_URL}/movie/${movie.id}/credits?language=pt-BR`,
      { headers: TMDB_CONFIG.HEADERS }
    );
    const creditsData = await creditsRes.json();

    setMovie({
      title: movie.title,
      overview: movie.overview,
      poster: `${TMDB_CONFIG.IMAGE_URL}/w300${movie.poster_path}`,
      year: Number(movie.release_date.split("-")[0]),
    });

    setCast(creditsData.cast);
  }

  return (
    <div className="search-box">
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Digite o nome do filme"
      />
      <button onClick={searchMovie}>Buscar</button>
    </div>
  );
}
