import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import {
  addToSearchHistory,
  getLastSearch,
  getSearchHistory,
  saveLastSearch,
  type SearchHistoryItem,
} from "../utils/searchStorage";
import type { SearchType } from "../types/SearchType";
import type { SearchResultItem } from "../types/SearchResult";
import { getMovies, getTvShows, getPeople } from "../api/tmdbService";
import SearchForm from "../components/SearchForm";
import SearchResults from "../components/SearchResults";
import { Box, Button, HStack, Spinner, Stack, Text } from "@chakra-ui/react";

interface SearchParams {
  query: string;
  type: SearchType;
  page: number;
}

async function fetchSearchResults({ query, type, page }: SearchParams) {
  try {
    let response;
    if (type === "movie") response = await getMovies(query, page);
    if (type === "tv") response = await getTvShows(query, page);
    if (type === "person") response = await getPeople(query, page);
    return {
      results: (response?.data?.results ?? []) as SearchResultItem[],
      totalPages: response?.data?.total_pages ?? 1,
    };
  } catch (err) {
    const status = axios.isAxiosError(err) ? err.response?.status : undefined;
    if (status === 400 || status === 404) return { results: [], totalPages: 1 };
    throw err;
  }
}

export default function HomePage() {
  const [inputQuery, setInputQuery] = useState(() => getLastSearch()?.query ?? "");
  const [inputType, setInputType] = useState<SearchType>(
    () => getLastSearch()?.type ?? "movie",
  );
  const [searchParams, setSearchParams] = useState<SearchParams | null>(null);
  const [history, setHistory] = useState<SearchHistoryItem[]>(() => getSearchHistory());

  useEffect(() => {
    document.title = "Movies";
  }, []);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["search", searchParams?.query, searchParams?.type, searchParams?.page],
    queryFn: () => fetchSearchResults(searchParams!),
    enabled: !!searchParams,
  });

  const results = data?.results ?? [];
  const totalPages = data?.totalPages ?? 1;
  const currentPage = searchParams?.page ?? 1;

  function handleSearch() {
    if (!inputQuery.trim()) return;
    saveLastSearch(inputQuery, inputType);
    addToSearchHistory(inputQuery, inputType);
    setHistory(getSearchHistory());
    setSearchParams({ query: inputQuery, type: inputType, page: 1 });
  }

  function goToPage(page: number) {
    setSearchParams((prev) => prev ? { ...prev, page } : null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const hasSearched = !!searchParams;

  return (
    <Box className="container">
      <SearchForm
        query={inputQuery}
        type={inputType}
        onQueryChange={setInputQuery}
        onTypeChange={setInputType}
        onSearch={handleSearch}
      />

      {isLoading && (
        <Box textAlign="center" mt={6}>
          <Spinner />
        </Box>
      )}

      {!isLoading && isError && (
        <Text mt={4} color="red.500">
          Erro ao buscar dados. Tente novamente mais tarde.
        </Text>
      )}

      {hasSearched && !isLoading && !isError && results.length === 0 && (
        <Text mt={4} color="gray.500">
          Nenhum resultado encontrado.
        </Text>
      )}

      {results.length > 0 && (
        <>
          <SearchResults results={results} type={inputType} />

          <HStack justify="center" mt={6} spacing={4}>
            <Button
              size="sm"
              onClick={() => goToPage(currentPage - 1)}
              isDisabled={currentPage <= 1}
            >
              Anterior
            </Button>
            <Text fontSize="sm" color="gray.600">
              Página {currentPage} de {totalPages}
            </Text>
            <Button
              size="sm"
              onClick={() => goToPage(currentPage + 1)}
              isDisabled={currentPage >= totalPages}
            >
              Próxima
            </Button>
          </HStack>
        </>
      )}

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
                  setInputQuery(item.query);
                  setInputType(item.type);
                  setSearchParams({ query: item.query, type: item.type, page: 1 });
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
