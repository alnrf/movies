import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  getTvShowDetail,
  
  getTvActors,
} from "../api/tmdbService";
import CastCard from "../components/CastCard";

export default function TVDetailPage() {
  const { id } = useParams();
  const [tv, setTv] = useState<any>(null);
  const [cast, setCast] = useState<any[]>([]);

  useEffect(() => {
    async function fetchData() {
      if (!id) return;

      const [detailRes, creditsRes] = await Promise.all([
        getTvShowDetail(Number(id)),
        getTvActors(Number(id)), 
      ]);

      setTv(detailRes.data);
      setCast(creditsRes.data.cast);
    }

    fetchData();
  }, [id]);

  if (!tv) return null;

  return (
    <div className="container">
      {tv.backdrop_path && (
        <img
          src={`https://image.tmdb.org/t/p/w780${tv.backdrop_path}`}
          alt={tv.name}
        />
      )}

      <h1>{tv.name}</h1>

      <p>{tv.overview}</p>

      <p>
        <strong>First air date:</strong>{" "}
        {tv.first_air_date}
      </p>

      <div className="cast-grid">
        {cast.map((actor) => (
          <CastCard key={actor.id} actor={actor} />
        ))}
      </div>
    </div>
  );
}
