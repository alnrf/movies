import { useEffect, useState } from "react";
import type { Person } from "../types/Person";
import { TMDB_CONFIG } from "../config/tmdb";
import type { MovieCredit } from "../types/MovieCredit";

interface Props {
  actorId: number;
  movieYear: number;
  onClose: () => void;
}

export default function ActorModal({ actorId, movieYear, onClose }: Props) {
  const [actor, setActor] = useState<Person | null>(null);
  const [movies, setMovies] = useState<MovieCredit[]>([]);

  useEffect(() => {
    async function fetchData() {
      const [personRes, creditsRes] = await Promise.all([
        fetch(`${TMDB_CONFIG.BASE_URL}/person/${actorId}?language=pt-BR`, {
          headers: TMDB_CONFIG.HEADERS,
        }),
        fetch(
          `${TMDB_CONFIG.BASE_URL}/person/${actorId}/movie_credits?language=pt-BR`,
          { headers: TMDB_CONFIG.HEADERS }
        ),
      ]);

      const personData = await personRes.json();
      const creditsData = await creditsRes.json();

      setActor(personData);
      setMovies(creditsData.cast);
    }

    fetchData();
  }, [actorId]);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  useEffect(() => {
    // trava scroll do body
    document.body.style.overflow = "hidden";

    return () => {
      // libera scroll ao fechar modal
      document.body.style.overflow = "";
    };
  }, []);

  if (!actor) return null;

  const birthYear = actor.birthday
    ? new Date(actor.birthday).getFullYear()
    : null;

  const deathYear = actor.deathday
    ? new Date(actor.deathday).getFullYear()
    : null;

  const currentYear = new Date().getFullYear();

  let ageNow: number | string = "—";

  if (birthYear) {
    if (deathYear) {
      ageNow = deathYear - birthYear;
    } else {
      ageNow = currentYear - birthYear;
    }
  }

  const ageInMovie = birthYear ? movieYear - birthYear : "—";

  const sortedMovies = [...movies].sort((a, b) => {
    if (!a.release_date) return 1;
    if (!b.release_date) return -1;
    return (
      new Date(b.release_date).getTime() - new Date(a.release_date).getTime()
    );
  });

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal modal-wide" onClick={(e) => e.stopPropagation()}>
        {/* COLUNA ESQUERDA — ATOR */}
        <div className="actor-details">
          <div className="actor-scroll">
            <img
              src={
                actor.profile_path
                  ? `${TMDB_CONFIG.IMAGE_URL}/w300${actor.profile_path}`
                  : "https://via.placeholder.com/300x450"
              }
              alt={actor.name}
            />

            <h2>{actor.name}</h2>

            <p>
              <strong>Nascimento:</strong> {actor.birthday || "—"}
            </p>

            {actor.deathday && (
              <p>
                <strong>Falecimento:</strong> {actor.deathday}
              </p>
            )}

            <p>
              <strong>Idade no filme:</strong> {ageInMovie}
            </p>

            <p>
              <strong>
                {actor.deathday ? "Idade ao falecer:" : "Idade atual:"}
              </strong>{" "}
              {ageNow}
            </p>
          </div>

          <div className="modal-footer">
            <button className="close-button" onClick={onClose}>
              Fechar
            </button>
          </div>
        </div>

        {/* COLUNA DIREITA — FILMES */}
        <div className="actor-movies">
          <h3>Filmes</h3>
          <ul>
            {sortedMovies.map((movie) => (
              <li key={movie.id}>
                <div className="movie-title">
                  {movie.title}
                  {movie.release_date && (
                    <span> ({new Date(movie.release_date).getFullYear()})</span>
                  )}
                </div>
                <div className="movie-character">{movie.character}</div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
