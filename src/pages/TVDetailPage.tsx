import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getTvShowDetail, getCredits } from "../api/tmdbService";
import CastCard from "../components/CastCard";
import { getBackdropUrl } from "../utils/tmdbImage";
import { getYearFromDate, formatDate } from "../utils/date";
import {
  Badge,
  Box,
  Button,
  Divider,
  Flex,
  Grid,
  Heading,
  Image,
  Stack,
  Text,
} from "@chakra-ui/react";
import SeasonsModal from "../components/SeasonsModal";
import EpisodeDetailModal from "../components/EpisodeDetailModal";

export default function TVDetailPage() {
  const { id } = useParams();
  const [tv, setTv] = useState<any>(null);
  const [cast, setCast] = useState<any[]>([]);
  const [isSeasonsModalOpen, setIsSeasonsModalOpen] = useState(false);
  const [selectedSeason, setSelectedSeason] = useState<number | null>(null);
  const [isEpisodeDetailModalOpen, setIsEpisodeDetailModalOpen] = useState(false);
  const [selectedEpisode, setSelectedEpisode] = useState<number | null>(null);

  useEffect(() => {
    async function fetchData() {
      if (!id) return;

      const [detailRes, creditsRes] = await Promise.all([
        getTvShowDetail(Number(id)),
        getCredits("tv", Number(id)),
      ]);

      setTv(detailRes.data);
      setCast(creditsRes.data.cast);
    }

    fetchData();
  }, [id]);

  if (!tv) return null;

  const launchYear = getYearFromDate(tv.first_air_date);

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
          justifyContent={"space-between"}
          alignItems={"center"}
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
          justifyContent={"space-between"}
          alignItems={"center"}
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
          <Button
            onClick={() => setIsSeasonsModalOpen(true)}
            colorScheme="teal"
          >
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
            base: "1fr", // mobile
            md: "repeat(2, 1fr)", // tablet (opcional)
            lg: "repeat(5, 1fr)", // desktop
          }}
          gap={6}
          mt={4}
        >
          {cast.map(
            (actor) =>
              launchYear && (
                <CastCard
                  key={actor.id}
                  actor={actor}
                />
              ),
          )}
        </Grid>
      </Box>
      {isSeasonsModalOpen && (
        <SeasonsModal
          isOpen={isSeasonsModalOpen}
          onClose={() => setIsSeasonsModalOpen(false)}
          tvId={Number(id)}
          seasons={tv.number_of_seasons}
          onEpisodeSelect={(season, episode) => {
            setSelectedSeason(season);
            setSelectedEpisode(episode);
            setIsEpisodeDetailModalOpen(true);
          }}
        />
      )}
      {isEpisodeDetailModalOpen && selectedSeason && selectedEpisode && (
        <EpisodeDetailModal
          tvId={Number(id)}
          seasonNumber={selectedSeason}
          episodeNumber={selectedEpisode}
          isOpen={isEpisodeDetailModalOpen}
          onClose={() => setIsEpisodeDetailModalOpen(false)}
        />
      )}
    </>
  );
}
