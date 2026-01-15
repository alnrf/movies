import { useState } from "react";
import MovieSearch from "./components/MovieSearch";
import CastCard from "./components/CastCard";
import type { Movie } from "./types/Movie";
import type { Cast } from "./types/Cast";
import "./styles.css";
import ActorModal from "./components/ActorModal";

function App() {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [cast, setCast] = useState<Cast[]>([]);
  const [selectedActor, setSelectedActor] = useState<number | null>(null);

  return (
    <div className="container">
      <h1>Busca de Filmes</h1>

      <MovieSearch setMovie={setMovie} setCast={setCast} />

      {movie && (
        <div className="movie-info">
          <img src={movie.poster} alt={movie.title} />
          <div>
            <h2>{movie.title}</h2>
            <p>{movie.overview}</p>
            <p>
              <strong>Ano:</strong> {movie.year}
            </p>
          </div>
        </div>
      )}

      <div className="cast-grid">
        {cast.map((actor) => (
          <CastCard
            key={actor.id}
            actor={actor}
            onClick={() => setSelectedActor(actor.id)}
          />
        ))}
      </div>
      {selectedActor && movie && (
        <ActorModal
          actorId={selectedActor}
          movieYear={movie.year}
          onClose={() => setSelectedActor(null)}
        />
      )}
    </div>
  );
}

export default App;
