import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Box, Button, Heading, HStack, Spinner, Text } from "@chakra-ui/react";
import { getMovies, getTvShows, getPeople, getPopular } from "../api/tmdbService";
import SearchResults from "../components/SearchResults";
import { parseSearchType, SEARCH_TYPE_LABELS } from "../utils/searchType";
import type { SearchType } from "../types/SearchType";
import type { SearchResultItem } from "../types/SearchResult";

/** A API do TMDB não aceita páginas acima de 500. */
const MAX_PAGES = 500;

const SEARCH_FN: Record<SearchType, typeof getMovies> = {
  movie: getMovies,
  tv: getTvShows,
  person: getPeople,
};

async function fetchResults(query: string, type: SearchType, page: number) {
  try {
    const response = query ? await SEARCH_FN[type](query, page) : await getPopular(type, page);
    return {
      results: (response.data?.results ?? []) as SearchResultItem[],
      totalPages: Math.min(response.data?.total_pages ?? 1, MAX_PAGES),
    };
  } catch (err) {
    const status = axios.isAxiosError(err) ? err.response?.status : undefined;
    if (status === 400 || status === 404) return { results: [], totalPages: 1 };
    throw err;
  }
}

/** Resultados de busca; sem termo de busca, mostra os populares do tipo escolhido. */
export default function SearchPage() {
  const [params, setParams] = useSearchParams();
  const query = params.get("query")?.trim() ?? "";
  const type = parseSearchType(params.get("type"));
  const page = Math.max(1, Number(params.get("page")) || 1);
  const label = SEARCH_TYPE_LABELS[type];

  const { data, isLoading, isError } = useQuery({
    queryKey: ["search", query, type, page],
    queryFn: () => fetchResults(query, type, page),
  });

  const title = query ? `Resultados para "${query}" em ${label}` : `${label} populares`;

  useEffect(() => {
    document.title = `${title} — Movies`;
    return () => {
      document.title = "Movies";
    };
  }, [title]);

  const results = data?.results ?? [];
  const totalPages = data?.totalPages ?? 1;

  function goToPage(next: number) {
    setParams((prev) => {
      const updated = new URLSearchParams(prev);
      updated.set("page", String(next));
      return updated;
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <Box maxW="1000px">
      <Heading as="h1" size="lg" mb={4}>
        {title}
      </Heading>

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

      {!isLoading && !isError && results.length === 0 && (
        <Text mt={4} color="text.muted">
          Nenhum resultado encontrado.
        </Text>
      )}

      {results.length > 0 && (
        <>
          <SearchResults results={results} type={type} recordRecent={!!query} />

          <HStack justify="center" mt={6} spacing={4}>
            <Button size="sm" onClick={() => goToPage(page - 1)} isDisabled={page <= 1}>
              Anterior
            </Button>
            <Text fontSize="sm" color="text.secondary">
              Página {page} de {totalPages}
            </Text>
            <Button
              size="sm"
              onClick={() => goToPage(page + 1)}
              isDisabled={page >= totalPages}
            >
              Próxima
            </Button>
          </HStack>
        </>
      )}
    </Box>
  );
}
