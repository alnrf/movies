import { useEffect, useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Box, Heading, Skeleton, Stack, Text } from "@chakra-ui/react";
import { getPopular, getUpcomingMovies } from "../api/tmdbService";
import { getRecentItems, type RecentItem } from "../utils/searchStorage";
import { getPosterUrl } from "../utils/tmdbImage";
import HeroCarousel from "../components/HeroCarousel";
import PosterCarousel from "../components/PosterCarousel";
import ActorModal from "../components/ActorModal";
import type { MovieListItem } from "../types/Movie";

const HERO_LIMIT = 10;

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <Box as="section" mt={10}>
      <Heading as="h2" size="md" mb={4}>
        {title}
      </Heading>
      {children}
    </Box>
  );
}

function ErrorText() {
  return <Text color="red.500">Não foi possível carregar. Tente novamente mais tarde.</Text>;
}

export default function HomePage() {
  const navigate = useNavigate();
  const [recentItems] = useState<RecentItem[]>(() => getRecentItems());
  const [selectedActor, setSelectedActor] = useState<number | null>(null);

  useEffect(() => {
    document.title = "Movies";
  }, []);

  const popular = useQuery({
    queryKey: ["movies", "popular"],
    queryFn: async () => (await getPopular("movie")).data.results as MovieListItem[],
  });

  const upcoming = useQuery({
    queryKey: ["movies", "upcoming"],
    queryFn: async () => (await getUpcomingMovies()).data.results as MovieListItem[],
  });

  const heroMovies = (popular.data ?? []).filter((m) => m.backdrop_path).slice(0, HERO_LIMIT);

  return (
    <Box>
      <Heading as="h1" className="sr-only">
        Movie Search
      </Heading>

      {/* POPULARES */}
      {popular.isLoading && <Skeleton h={{ base: "220px", md: "380px" }} borderRadius="2xl" />}
      {popular.isError && <ErrorText />}
      {heroMovies.length > 0 && <HeroCarousel movies={heroMovies} label="Filmes populares" />}

      {/* BUSCAS RECENTES */}
      {recentItems.length > 0 && (
        <Section title="Buscas recentes">
          <PosterCarousel
            label="Buscas recentes"
            items={recentItems.map((item) => ({
              key: `${item.type}-${item.id}`,
              title: item.name,
              imageUrl: getPosterUrl(item.imagePath, "MEDIUM"),
              onClick: () =>
                item.type === "person"
                  ? setSelectedActor(item.id)
                  : navigate(`/${item.type}/${item.id}`),
            }))}
          />
        </Section>
      )}

      {/* EM BREVE */}
      <Section title="Em breve nos cinemas">
        {upcoming.isLoading && (
          <Stack direction="row" spacing={4} overflow="hidden">
            {Array.from({ length: 6 }, (_, i) => (
              <Skeleton key={i} w="160px" h="240px" borderRadius="lg" flexShrink={0} />
            ))}
          </Stack>
        )}
        {upcoming.isError && <ErrorText />}
        {upcoming.data && (
          <PosterCarousel
            label="Filmes em breve nos cinemas"
            items={upcoming.data.map((movie) => ({
              key: String(movie.id),
              title: movie.title,
              subtitle: movie.original_title,
              imageUrl: getPosterUrl(movie.poster_path, "MEDIUM"),
              onClick: () => navigate(`/movie/${movie.id}`),
            }))}
          />
        )}
      </Section>

      {selectedActor !== null && (
        <ActorModal actorId={selectedActor} open onClose={() => setSelectedActor(null)} />
      )}
    </Box>
  );
}
