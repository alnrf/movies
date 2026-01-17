import { useEffect, useState } from "react";
import {
  getActorDetail,
  getActorMovies,
} from "../api/tmdbService";

export default function ActorModal({ actorId, onClose }: any) {
  const [actor, setActor] = useState<any>(null);
  const [movies, setMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.body.style.overflow = "hidden";

    async function fetchData() {
      try {
        const [detail, credits] = await Promise.all([
          getActorDetail(actorId),
          getActorMovies(actorId),
        ]);

        setActor(detail.data);
        setMovies(credits.data.cast);
      } finally {
        setLoading(false);
      }
    }

    fetchData();

    return () => {
      document.body.style.overflow = "";
    };
  }, [actorId]);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal modal-wide"
        onClick={(e) => e.stopPropagation()}
      >
        {/* COLUNA ESQUERDA */}
        <div className="actor-details">
          <div className="actor-scroll">
            {loading && <p>Carregando...</p>}

            {!loading && actor && (
              <>
                <img
                  src={
                    actor.profile_path
                      ? `https://image.tmdb.org/t/p/w300${actor.profile_path}`
                      : "https://via.placeholder.com/300x450"
                  }
                  alt={actor.name}
                />

                <h2>{actor.name}</h2>

                <p>
                  <strong>Nascimento:</strong>{" "}
                  {actor.birthday || "—"}
                </p>
              </>
            )}
          </div>

          <div className="modal-footer">
            <button className="close-button" onClick={onClose}>
              Fechar
            </button>
          </div>
        </div>

        {/* COLUNA DIREITA */}
        <div className="actor-movies">
          <h3>Filmografia</h3>

          <ul>
            {movies.map((m) => (
              <li key={m.id}>
                <div className="movie-title">
                  {m.title}
                </div>
                <div className="movie-character">
                  {m.character}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
