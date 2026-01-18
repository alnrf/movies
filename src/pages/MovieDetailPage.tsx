import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  getMovieDetail,

  getCredits,
} from "../api/tmdbService";
import CastCard from "../components/CastCard";
import { format } from "date-fns";
import { getBackdropUrl } from "../utils/tmdbImage";

export default function MovieDetailPage() {
  const { id } = useParams();
  const [movie, setMovie] = useState<any>(null);
  const [cast, setCast] = useState<any[]>([]);

  useEffect(() => {
    async function fetchData() {
      const [detail, credits] = await Promise.all([
  getMovieDetail(Number(id)),
  getCredits("movie", Number(id)),
]);

      setMovie(detail.data);
      setCast(credits.data.cast);
    }

    fetchData();
  }, [id]);

  if (!movie) return null;

  const launchYear = movie.release_date
    ? new Date(movie.release_date).getFullYear()
    : null;

  return (
    <div className="container">
      <img
  src={getBackdropUrl(movie.backdrop_path, "LARGE")}
  alt={movie.title}
/>
      <h1>{movie.title}</h1>
      <p>{movie.overview}</p>

      <p>
        <strong>Lançamento:</strong>{" "}
        {format(movie.release_date, "dd/MM/yyyy")}
      </p>

      <div className="cast-grid">
        {cast.map((actor) => (
         launchYear && <CastCard key={actor.id} launchYear={launchYear} actor={actor} />
        ))}
      </div>
    </div>
  );
}
