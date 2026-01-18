import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getTvShowDetail, getCredits } from "../api/tmdbService";
import CastCard from "../components/CastCard";
import { format } from "date-fns";
import { getBackdropUrl } from "../utils/tmdbImage";

export default function TVDetailPage() {
  const { id } = useParams();
  const [tv, setTv] = useState<any>(null);
  const [cast, setCast] = useState<any[]>([]);

  useEffect(() => {
    async function fetchData() {
      if (!id) return;

      const [detailRes, creditsRes] = await Promise.all([
        getTvShowDetail(Number(id)),
        getCredits("tv", Number(id)),
      ]);

      setTv(detailRes.data);
      setCast(creditsRes.data.cast);
    }

    fetchData();
  }, [id]);

  if (!tv) return null;

  const launchYear = tv.first_air_date
    ? new Date(tv.first_air_date).getFullYear()
    : null;

  return (
    <div className="container">
      {tv.backdrop_path && (
        <img src={getBackdropUrl(tv.backdrop_path, "LARGE")} alt={tv.name} />
      )}

      <h1>{tv.name}</h1>
      <p>{tv.overview}</p>
      <p>
        <strong>Primeiro Episódio:</strong>{" "}
        {format(tv.first_air_date, "dd/MM/yyyy")}
      </p>

      <div className="cast-grid">
        {cast.map(
          (actor) =>
            launchYear && (
              <CastCard key={actor.id} launchYear={launchYear} actor={actor} />
            ),
        )}
      </div>
    </div>
  );
}
