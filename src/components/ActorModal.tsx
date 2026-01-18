import * as Dialog from "@radix-ui/react-dialog";
import { useEffect, useState } from "react";
import { getActorDetail, getActorMovies, getActorTv } from "../api/tmdbService";
import { getProfileUrl } from "../utils/tmdbImage";

interface Props {
  actorId: number;
  open: boolean;
  onClose: () => void;
  launchYear?: number | null;
}

export default function ActorModal({
  actorId,
  launchYear = null,
  open,
  onClose,
}: Props) {
  const [actor, setActor] = useState<any>(null);
  const [movies, setMovies] = useState<any[]>([]);
  const [tv, setTv] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!open) return;

    document.body.style.overflow = "hidden";

    async function fetchData() {
      try {
        const [detail, credits, tvCredits] = await Promise.all([
          getActorDetail(actorId),
          getActorMovies(actorId),
          getActorTv(actorId),
        ]);

        setActor(detail.data);
        setMovies(credits.data.cast);
        setTv(tvCredits.data.cast);
      } finally {
        setLoading(false);
      }
    }

    fetchData();

    return () => {
      document.body.style.overflow = "";
      setLoading(true);
      setActor(null);
      setMovies([]);
    };
  }, [actorId, open]);

  const birthYear = actor?.birthday
    ? new Date(actor.birthday).getFullYear()
    : null;

  const deathYear = actor?.deathday
    ? new Date(actor.deathday).getFullYear()
    : null;

  const currentYear = new Date().getFullYear();

  let ageNow: number | string = "—";

  if (birthYear) {
    ageNow = deathYear ? deathYear - birthYear : currentYear - birthYear;
  }

  const ageInMovie = birthYear && launchYear ? launchYear - birthYear : null;

  return (
    <Dialog.Root open={open} onOpenChange={(v) => !v && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="modal-overlay" />
        <Dialog.Content className="modal modal-wide">
          <Dialog.Title className="sr-only">Detalhes do ator</Dialog.Title>
          <div className="actor-details">
            <div className="actor-scroll">
              {loading && <p>Carregando...</p>}
              {!loading && actor && (
                <>
                 <img
  src={getProfileUrl(actor.profile_path, "MEDIUM")}
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
                    <strong>Idade:</strong> {ageNow} anos
                  </p>
                  {launchYear && ageInMovie !== null && (
                    <p>
                      <strong>Idade no filme:</strong> {ageInMovie} anos
                    </p>
                  )}
                </>
              )}
            </div>

            <div className="modal-footer">
              <Dialog.Close asChild>
                <button className="close-button">Fechar</button>
              </Dialog.Close>
            </div>
          </div>

          <div className="actor-movies">
            <h3>Filmografia</h3>

            <ul>
              {movies.map((m) => (
                <li key={m.id}>
                  <div className="movie-title">{m.title}</div>
                  <div className="movie-character">{m.character}</div>
                </li>
              ))}
            </ul>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
