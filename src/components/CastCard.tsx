import { useState } from "react";
import ActorModal from "./ActorModal";
import { getProfileUrl } from "../utils/tmdbImage";

interface Props {
  actor: any;
  launchYear: number;
}

export default function CastCard({ actor, launchYear }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="cast-card" onClick={() => setOpen(true)}>
        <img
          src={getProfileUrl(actor.profile_path, "SMALL")}
          alt={actor.name}
        />
        <p>
          <strong>{actor.name}</strong>
        </p>
        <p>{actor.character || actor.roles?.[0]?.character}</p>
      </div>

      {open && (
        <ActorModal
          actorId={actor.id}
          launchYear={launchYear}
          open={open}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}
