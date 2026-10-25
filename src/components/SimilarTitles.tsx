import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Text } from "@chakra-ui/react";
import { getSimilar } from "../api/tmdbService";
import { getPosterUrl } from "../utils/tmdbImage";
import PosterCarousel, { PosterCarouselSkeleton } from "./PosterCarousel";
import type { MovieListItem } from "../types/Movie";
import type { TvShowSearchResult } from "../types/TvShow";

interface Props {
  mediaType: "movie" | "tv";
  id: number;
  /** Nome do filme ou série, usado no rótulo acessível da faixa. */
  title: string;
}

interface SimilarItem {
  id: number;
  title: string;
  originalTitle: string;
  posterPath: string | null;
}

/** Normaliza filmes (title) e séries (name) para o mesmo formato. */
function toSimilarItem(item: MovieListItem | TvShowSearchResult): SimilarItem {
  return "title" in item
    ? { id: item.id, title: item.title, originalTitle: item.original_title, posterPath: item.poster_path }
    : { id: item.id, title: item.name, originalTitle: item.original_name, posterPath: item.poster_path };
}

/** Faixa de títulos semelhantes; cada card leva ao detalhe do título. */
export default function SimilarTitles({ mediaType, id, title }: Props) {
  const navigate = useNavigate();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["similar", mediaType, id],
    queryFn: async () => {
      const results = (await getSimilar(mediaType, id)).data.results as (
        | MovieListItem
        | TvShowSearchResult
      )[];
      return (results ?? []).map(toSimilarItem);
    },
  });

  if (isLoading) return <PosterCarouselSkeleton />;
  if (isError) return <Text color="red.500">Não foi possível carregar os títulos semelhantes.</Text>;
  if (!data || data.length === 0) {
    return <Text color="text.muted">Nenhum título semelhante encontrado.</Text>;
  }

  return (
    <PosterCarousel
      label={`Títulos semelhantes a ${title}`}
      items={data.map((item) => ({
        key: String(item.id),
        title: item.title,
        subtitle: item.originalTitle,
        imageUrl: getPosterUrl(item.posterPath, "MEDIUM"),
        onClick: () => {
          navigate(`/${mediaType}/${item.id}`);
          // A página de detalhe é reaproveitada: volta ao topo para mostrar o novo título.
          window.scrollTo({ top: 0 });
        },
      }))}
    />
  );
}
