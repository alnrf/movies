import { useState } from "react";

import type { SearchType } from "../types/SearchType";
import { getMovies, getTvShows, getPeople } from "../api/tmdbService";
import SearchForm from "../components/SearchForm";
import SearchResults from "../components/SearchResults";

export default function HomePage() {
  const [query, setQuery] = useState("");
  const [type, setType] = useState<SearchType>("movie");
  const [results, setResults] = useState<any[]>([]);

  async function handleSearch() {
    if (!query) return;

    let response;

    if (type === "movie") response = await getMovies(query);
    if (type === "tv") response = await getTvShows(query);
    if (type === "person") response = await getPeople(query);

    setResults(response?.data.results || []);
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

      <SearchResults results={results} type={type} />
    </div>
  );
}
