import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getMovieDetail, getCredits } from "../api/tmdbService";
import CastCard from "../components/CastCard";
import { format } from "date-fns";
import { getBackdropUrl } from "../utils/tmdbImage";
import { Grid } from "@chakra-ui/react/grid";
import { Badge, Box, Heading, Image, Stack, Text } from "@chakra-ui/react";
import { getYearFromDate } from "../utils/date";

export default function MovieDetailPage() {
  const { id } = useParams();
  const [movie, setMovie] = useState<any>(null);
  const [cast, setCast] = useState<any[]>([]);

  useEffect(() => {
    async function fetchData() {
      const [detail, credits] = await Promise.all([
        getMovieDetail(Number(id)),
        getCredits("movie", Number(id)),
      ]);

      setMovie(detail.data);
      setCast(credits.data.cast);
    }

    fetchData();
  }, [id]);

  if (!movie) return null;

  const launchYear = getYearFromDate(movie.release_date);

  const currency = {
    style: "currency",
    currency: "BRL",
  };

  return (
    <Box maxW="1000px" mx="auto" p={4}>
      <Stack
        direction={{ base: "column", md: "row" }}
        spacing={6}
        align="flex-start"
      >
        <Image
          src={getBackdropUrl(movie.backdrop_path, "LARGE")}
          alt={movie.title}
          borderRadius="md"
          maxW={{ base: "100%", md: "420px" }}
          objectFit="cover"
        />

        <Box>
          <Heading as="h1" size="lg" mb={3}>
            {movie.title}
          </Heading>

          <Text fontSize="md" color="gray.700">
            {movie.overview}
          </Text>
        </Box>
      </Stack>

      <Heading as="h3" size="md" mb={3} mt={6}>
        Informações do Filme
      </Heading>
      <Text>
        <Text as="span" fontWeight="semibold">
          Lançamento:
        </Text>{" "}
        {format(movie.release_date, "dd/MM/yyyy")}
      </Text>
      <Text>
        <Text as="span" fontWeight="semibold">
          Título original:
        </Text>{" "}
        {movie.original_title}
      </Text>
      <Text>
        <Text as="span" fontWeight="semibold">
          Orçamento:
        </Text>{" "}
        {movie.budget.toLocaleString("pt-BR", currency)}
      </Text>
      <Text>
        <Text as="span" fontWeight="semibold">
          Faturamento:
        </Text>{" "}
        {movie.revenue.toLocaleString("pt-BR", currency)}
      </Text>
      <Stack direction="row" mb={3} mt={3} spacing={2}>
        {movie.genres.map((genre: any) => (
          <Badge key={genre.id}>{genre.name}</Badge>
        ))}
      </Stack>

      <Heading as="h3" size="md" mb={3} mt={6}>
        Elenco do Filme
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
              <CastCard key={actor.id} launchYear={launchYear} actor={actor} />
            ),
        )}
      </Grid>
    </Box>
  );
}
