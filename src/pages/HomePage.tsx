import { useEffect, useState } from "react";
import { addToSearchHistory, getLastSearch, getSearchHistory } from "../utils/searchStorage";
import type { SearchType } from "../types/SearchType";
import { getMovies, getTvShows, getPeople } from "../api/tmdbService";
import SearchForm from "../components/SearchForm";
import SearchResults from "../components/SearchResults";
import { Box, Button, Spinner, Stack, Text } from "@chakra-ui/react";
import { saveLastSearch } from "../utils/searchStorage";

export default function HomePage() {
  const [query, setQuery] = useState("");
  const [type, setType] = useState<SearchType>("movie");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [history, setHistory] = useState<any[]>([]);

    useEffect(() => {
    const last = getLastSearch();
    if (last) {
      setQuery(last.query);
      setType(last.type);
    }

    setHistory(getSearchHistory());
  }, []);

  async function handleSearch() {
    if (!query) return;

  setHasSearched(true);
    setLoading(true);
    setError(null);
    setResults([]);

    saveLastSearch(query, type);
    addToSearchHistory(query, type);
    setHistory(getSearchHistory());

    try {
      let response;

      if (type === "movie") response = await getMovies(query);
      if (type === "tv") response = await getTvShows(query);
      if (type === "person") response = await getPeople(query);

      const data = response?.data?.results ?? [];

      if (data.length === 0) {
        setResults([]);
      } else {
        setResults(data);
      }
    } catch (err: any) {
      const status = err?.response?.status;

      if (status === 400 || status === 404) {
        setResults([]);
      } else {
        setError("Erro ao buscar dados. Tente novamente mais tarde.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <Box className="container">
      <SearchForm
        query={query}
        type={type}
        onQueryChange={setQuery}
        onTypeChange={setType}
        onSearch={handleSearch}
      />

     {loading && (
  <Box textAlign="center" mt={6}>
    <Spinner />
  </Box>
)}

  {/* ERROR */}
      {!loading && error && (
        <Text mt={4} color="red.500">
          {error}
        </Text>
      )}

      {/* EMPTY RESULT */}
      {hasSearched && !loading && !error && results.length === 0 && (
        <Text mt={4} color="gray.500">
          Nenhum resultado encontrado.
        </Text>
      )}

      {/* RESULTS */}
      {results.length > 0 && (
        <SearchResults results={results} type={type} />
      )}

      {/* SEARCH HISTORY */}
      {!hasSearched && history.length > 0 && (
        <Box mt={8}>
          <Text fontWeight="600" mb={3}>
            Buscas recentes
          </Text>

          <Stack spacing={2}>
            {history.map((item, index) => (
              <Button
                key={index}
                variant="ghost"
                justifyContent="flex-start"
                onClick={() => {
                  setQuery(item.query);
                  setType(item.type);
                  handleSearch();
                }}
              >
                {item.query}
                <Text as="span" color="gray.500" ml={2}>
                  ({item.type})
                </Text>
              </Button>
            ))}
          </Stack>
        </Box>
      )}
    </Box>
  );
}
