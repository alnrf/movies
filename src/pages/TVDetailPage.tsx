import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getTvShowDetail, getCredits } from "../api/tmdbService";
import CastCard from "../components/CastCard";
import DetailSection from "../components/DetailSection";
import MediaGallery from "../components/MediaGallery";
import SimilarTitles from "../components/SimilarTitles";
import { getBackdropUrl } from "../utils/tmdbImage";
import { formatDate } from "../utils/date";
import WatchProviders from "../components/WatchProviders";
import type { TvShowDetail } from "../types/TvShow";
import type { CastMember } from "../types/Cast";
import {
  Badge,
  Box,
  Button,
  Divider,
  Flex,
  Grid,
  Heading,
  Image,
  SimpleGrid,
  Spinner,
  Stack,
  Text,
} from "@chakra-ui/react";
import SeasonsModal from "../components/SeasonsModal";
import EpisodeDetailModal from "../components/EpisodeDetailModal";

export default function TVDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const numericId = Number(id);

  const [isSeasonsModalOpen, setIsSeasonsModalOpen] = useState(false);
  const [selectedSeason, setSelectedSeason] = useState<number | null>(null);
  const [isEpisodeDetailModalOpen, setIsEpisodeDetailModalOpen] =
    useState(false);
  const [selectedEpisode, setSelectedEpisode] = useState<number | null>(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["tv", numericId],
    queryFn: async () => {
      const [detailRes, creditsRes] = await Promise.all([
        getTvShowDetail(numericId),
        getCredits("tv", numericId),
      ]);
      return {
        tv: detailRes.data as TvShowDetail,
        cast: creditsRes.data.cast as CastMember[],
      };
    },
    enabled: !isNaN(numericId),
  });

  useEffect(() => {
    if (data?.tv) document.title = `${data.tv.name} — Movies`;
    return () => { document.title = "Movies"; };
  }, [data?.tv]);

  if (!id || isNaN(numericId)) {
    navigate("/404", { replace: true });
    return null;
  }

  if (isLoading) {
    return (
      <Box textAlign="center" mt={20}>
        <Spinner size="xl" />
      </Box>
    );
  }

  if (isError || !data?.tv) {
    return (
      <Box textAlign="center" py={20} px={6}>
        <Heading size="lg" mb={4}>
          Série não encontrada
        </Heading>
        <Text color="text.muted" mb={6}>
          Não foi possível carregar as informações desta série.
        </Text>
        <Button colorScheme="teal" onClick={() => navigate("/")}>
          Voltar para a busca
        </Button>
      </Box>
    );
  }

  const { tv, cast } = data;

  return (
    <>
      <Box maxW="1200px" mx="auto" p={4}>
        <Stack
          direction={{ base: "column", md: "row" }}
          spacing={6}
          align="flex-start"
        >
          {tv.backdrop_path && (
            <Image
              src={getBackdropUrl(tv.backdrop_path, "LARGE")}
              alt={tv.name}
              borderRadius="md"
              maxW={{ base: "100%", md: "420px" }}
              objectFit="cover"
            />
          )}
          <Box>
            <Heading as="h1" size="lg" mb={3}>
              {tv.name}
            </Heading>
            <Text fontSize="md" color="text.secondary">
              {tv.overview}
            </Text>
          </Box>
        </Stack>

        <Stack direction={{ base: "column", lg: "row" }} spacing={8} align="flex-start" mt={6}>
          <Box flex="1" minW={0}>
            <Heading as="h3" size="md" mb={3}>
              Informações do Programa
            </Heading>
            <SimpleGrid
              columns={{ base: 2, md: 3 }}
              spacingX={4}
              spacingY={3}
              mb={3}
              mt={3}
              alignItems="center"
            >
              {[
                { label: "Primeiro Episódio:", value: formatDate(tv.first_air_date) || "—" },
                { label: "Último Episódio:", value: formatDate(tv.last_air_date) || "—" },
                {
                  label: "Próximo Episódio:",
                  value: formatDate(tv.next_episode_to_air?.air_date) || "—",
                },
                { label: "Número de Episódios:", value: tv.number_of_episodes },
                { label: "Número de Temporadas:", value: tv.number_of_seasons },
              ].map(({ label, value }) => (
                <Flex
                  key={label}
                  direction={{ base: "column", md: "row" }}
                  gap={{ base: 0, md: 2 }}
                >
                  <Text as="span" fontWeight="semibold">
                    {label}
                  </Text>
                  <Text as="span">{value}</Text>
                </Flex>
              ))}
              <Button
                onClick={() => setIsSeasonsModalOpen(true)}
                colorScheme="teal"
                gridColumn={{ base: "1 / -1", md: "auto" }}
                w={{ base: "100%", md: "auto" }}
                justifySelf={{ md: "start" }}
              >
                Ver Temporadas
              </Button>
            </SimpleGrid>

            <Stack direction="row" mb={3} mt={3} spacing={2}>
              {tv.genres.map((genre) => (
                <Badge key={genre.id}>{genre.name}</Badge>
              ))}
            </Stack>
          </Box>

          <Box w={{ base: "100%", lg: "360px" }} flexShrink={0}>
            <WatchProviders mediaType="tv" id={tv.id} />
          </Box>
        </Stack>

        <Divider mt={3} />

        <DetailSection title="Fotos do Programa">
          <MediaGallery mediaType="tv" id={tv.id} title={tv.name} />
        </DetailSection>

        <DetailSection title="Elenco do Programa">
          <Grid
            templateColumns={{
              base: "1fr",
              md: "repeat(2, 1fr)",
              lg: "repeat(5, 1fr)",
            }}
            gap={6}
          >
            {cast.map((actor) => (
              <CastCard key={actor.id} actor={actor} />
            ))}
          </Grid>
        </DetailSection>

        <DetailSection title="Séries Semelhantes">
          <SimilarTitles mediaType="tv" id={tv.id} title={tv.name} />
        </DetailSection>
      </Box>

      <SeasonsModal
        isOpen={isSeasonsModalOpen}
        onClose={() => setIsSeasonsModalOpen(false)}
        tvId={numericId}
        seasons={tv.number_of_seasons}
        onEpisodeSelect={(season, episode) => {
          setIsSeasonsModalOpen(false);
          setSelectedSeason(season);
          setSelectedEpisode(episode);
          setIsEpisodeDetailModalOpen(true);
        }}
      />
      {isEpisodeDetailModalOpen && selectedSeason && selectedEpisode && (
        <EpisodeDetailModal
          tvId={numericId}
          seasonNumber={selectedSeason}
          episodeNumber={selectedEpisode}
          isOpen={isEpisodeDetailModalOpen}
          onClose={() => {
            setIsEpisodeDetailModalOpen(false);
            setIsSeasonsModalOpen(true);
          }}
        />
      )}
    </>
  );
}
