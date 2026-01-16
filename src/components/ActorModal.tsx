import { useEffect, useState } from "react";
import type { Person } from "../types/Person";
import { TMDB_CONFIG } from "../config/tmdb";
import type { MovieCredit } from "../types/MovieCredit";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Props {
  actorId: number;
  movieYear: number;
  onClose: () => void;
}

const BIOGRAPHY_MAX_LENGTH = 150;

export default function ActorModal({ actorId, movieYear, onClose }: Props) {
  const [actor, setActor] = useState<Person | null>(null);
  const [movies, setMovies] = useState<MovieCredit[]>([]);
  const [bioToast, setBioToast] = useState<string | null>(null);

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
  document.body.style.overflow = "hidden";
  return () => {
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

    const truncateText = (text: string, maxLength: number): string => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  const handleBioClick = () => {
    if (actor?.biography) {
      setBioToast(actor.biography);
      setTimeout(() => setBioToast(null), 5000); // Toast desaparece em 5s
    }
  };

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
              <strong>Nascimento:</strong>{" "}
              {actor.birthday
                ? format(actor.birthday, "dd/MM/yyyy", { locale: ptBR })
                : "—"}
            </p>

            {actor.deathday && (
              <p>
                <strong>Falecimento:</strong>{" "}
                {actor.deathday
                  ? format(actor.deathday, "dd/MM/yyyy", { locale: ptBR })
                  : "—"}
              </p>
            )}

            <p>
              <strong>Idade no filme:</strong> {ageInMovie} anos
            </p>

            <p>
              <strong>Idade:</strong>
              {` ${ageNow} anos`}
            </p>
            <p>
              <strong>Local de Nascimento:</strong>
              {` ${actor.place_of_birth || "—"}`}
            </p>
             <p>
              <strong>Bio:</strong>
              {actor.biography ? (
                <button
                  onClick={handleBioClick}
                  style={{
                    background: "none",
                    border: "none",
                    color: "inherit",
                    cursor: "pointer",
                    textAlign: "left",
                    padding: 0,
                    marginLeft: "0.5em",
                  }}
                >
                  {truncateText(actor.biography, BIOGRAPHY_MAX_LENGTH)}
                </button>
              ) : (
                " —"
              )}
            </p>
              {bioToast && (
              <div className="toast">
                {bioToast}
              </div>
            )}
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
