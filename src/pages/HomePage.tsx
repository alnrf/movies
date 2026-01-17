import { useState } from "react";
import { useNavigate } from "react-router-dom";

import type { SearchType } from "../types/SearchType";
import {
  getMovies,
  getTvShows,
  getPeople,
} from "../api/tmdbService";
import SearchForm from "../components/SearchForm";

export default function HomePage() {
  const [query, setQuery] = useState("");
  const [type, setType] = useState<SearchType>("movie");
  const [results, setResults] = useState<any[]>([]);
  const navigate = useNavigate();

  async function handleSearch() {
    if (!query) return;

    let response;

    if (type === "movie") response = await getMovies(query);
    if (type === "tv") response = await getTvShows(query);
    if (type === "person") response = await getPeople(query);

    setResults(response?.data.results || []);
  }

function handleClick(item: any) {
  if (type === "movie") navigate(`/movie/${item.id}`);
  if (type === "tv") navigate(`/tv/${item.id}`);
}

  return (
    <div className="container">
      <SearchForm
        query={query}
        type={type}
        onQueryChange={setQuery}
        onTypeChange={setType}
        onSearch={handleSearch}
      />

      <ul>
        {results.map((item) => (
          <li key={item.id} onClick={() => handleClick(item)}>
            {item.title || item.name}
          </li>
        ))}
      </ul>
    </div>
  );
}
