import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getTvShowDetail, getCredits } from "../api/tmdbService";
import CastCard from "../components/CastCard";
import { getBackdropUrl } from "../utils/tmdbImage";
import { formatDate } from "../utils/date";
import {
  Badge,
  Box,
  Button,
  Divider,
  Flex,
  Grid,
  Heading,
  Image,
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
      return { tv: detailRes.data, cast: creditsRes.data.cast as any[] };
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
        <Text color="gray.500" mb={6}>
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
      <Box maxW="1000px" mx="auto" p={4}>
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
            <Text fontSize="md" color="gray.700">
              {tv.overview}
            </Text>
          </Box>
        </Stack>

        <Heading as="h3" size="md" mb={3} mt={6}>
          Informações do Programa
        </Heading>
        <Flex
          direction="row"
          mb={3}
          mt={3}
          justifyContent="space-between"
          alignItems="center"
        >
          <Flex direction="row" gap={2}>
            <Text as="span" fontWeight="semibold">
              Primeiro Episódio:
            </Text>
            <Text as="span">{formatDate(tv.first_air_date) || "—"}</Text>
          </Flex>
          <Flex direction="row" gap={2}>
            <Text as="span" fontWeight="semibold">
              Último Episódio:
            </Text>
            <Text as="span">{formatDate(tv.last_air_date) || "—"}</Text>
          </Flex>
          <Flex direction="row" gap={2}>
            <Text as="span" fontWeight="semibold">
              Próximo Episódio:
            </Text>
            <Text as="span">
              {formatDate(tv.next_episode_to_air?.air_date) || "—"}
            </Text>
          </Flex>
        </Flex>
        <Flex
          direction="row"
          mb={3}
          mt={3}
          justifyContent="space-between"
          alignItems="center"
        >
          <Flex direction="row" gap={2}>
            <Text as="span" fontWeight="semibold">
              Número de Episódios:
            </Text>
            <Text as="span">{tv.number_of_episodes}</Text>
          </Flex>
          <Flex direction="row" gap={2}>
            <Text as="span" fontWeight="semibold">
              Número de Temporadas:
            </Text>
            <Text as="span">{tv.number_of_seasons}</Text>
          </Flex>
          <Button onClick={() => setIsSeasonsModalOpen(true)} colorScheme="teal">
            Ver Temporadas
          </Button>
        </Flex>

        <Stack direction="row" mb={3} mt={3} spacing={2}>
          {tv.genres.map((genre: any) => (
            <Badge key={genre.id}>{genre.name}</Badge>
          ))}
        </Stack>
        <Divider mt={3} />

        <Heading as="h3" size="md" mb={3} mt={6}>
          Elenco do Programa
        </Heading>
        <Grid
          templateColumns={{
            base: "1fr",
            md: "repeat(2, 1fr)",
            lg: "repeat(5, 1fr)",
          }}
          gap={6}
          mt={4}
        >
          {cast.map((actor) => (
            <CastCard key={actor.id} actor={actor} />
          ))}
        </Grid>
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
