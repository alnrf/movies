import { useEffect, useState } from "react";
import type { Cast } from "../types/Cast";

import { TMDB_CONFIG } from "../config/tmdb";

interface Props {
  actor: Cast;
  onClick: () => void;
}
export default function CastCard({ actor, onClick }: Props) {
  return (
    <div className="cast-card" onClick={onClick}>
      <img
        src={
          actor.profile_path
            ? `${TMDB_CONFIG.IMAGE_URL}/w200${actor.profile_path}`
            : "https://via.placeholder.com/200x300"
        }
        alt={actor.name}
      />
      <h3>{actor.name}</h3>
      <p>{actor.character}</p>
    </div>
  );
}
