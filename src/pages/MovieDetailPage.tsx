import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  getMovieDetail,
  getMovieActors,
} from "../api/tmdbService";
import CastCard from "../components/CastCard";

export default function MovieDetailPage() {
  const { id } = useParams();
  const [movie, setMovie] = useState<any>(null);
  const [cast, setCast] = useState<any[]>([]);

  useEffect(() => {
    async function fetchData() {
      const [detail, credits] = await Promise.all([
        getMovieDetail(Number(id)),
        getMovieActors(Number(id)),
      ]);

      setMovie(detail.data);
      setCast(credits.data.cast);
    }

    fetchData();
  }, [id]);

  if (!movie) return null;

  return (
    <div className="container">
      <img
        src={`https://image.tmdb.org/t/p/w500${movie.backdrop_path}`}
      />
      <h1>{movie.title}</h1>
      <p>{movie.overview}</p>

      <div className="cast-grid">
        {cast.map((actor) => (
          <CastCard key={actor.id} actor={actor} />
        ))}
      </div>
    </div>
  );
}
