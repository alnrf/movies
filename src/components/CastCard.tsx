import { useState } from "react";
import ActorModal from "./ActorModal";

export default function CastCard({ actor }: { actor: any }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div
        className="cast-card"
        onClick={() => setOpen(true)}
      >
        <img
          src={
            actor.profile_path
              ? `https://image.tmdb.org/t/p/w200${actor.profile_path}`
              : "https://via.placeholder.com/200x300"
          }
          alt={actor.name}
        />
        <p>{actor.name}</p>
      </div>

      {open && (
        <ActorModal
          actorId={actor.id}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}
