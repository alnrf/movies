import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getMovieDetail, getCredits } from "../api/tmdbService";
import CastCard from "../components/CastCard";
import { format } from "date-fns";
import { getBackdropUrl } from "../utils/tmdbImage";
import { Grid } from "@chakra-ui/react/grid";
import {
  Badge,
  Box,
  Button,
  Heading,
  Image,
  Spinner,
  Stack,
  Text,
} from "@chakra-ui/react";

export default function MovieDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const numericId = Number(id);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["movie", numericId],
    queryFn: async () => {
      const [detail, credits] = await Promise.all([
        getMovieDetail(numericId),
        getCredits("movie", numericId),
      ]);
      return { movie: detail.data, cast: credits.data.cast as any[] };
    },
    enabled: !isNaN(numericId),
  });

  useEffect(() => {
    if (data?.movie) document.title = `${data.movie.title} — Movies`;
    return () => { document.title = "Movies"; };
  }, [data?.movie]);

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

  if (isError || !data?.movie) {
    return (
      <Box textAlign="center" py={20} px={6}>
        <Heading size="lg" mb={4}>
          Filme não encontrado
        </Heading>
        <Text color="gray.500" mb={6}>
          Não foi possível carregar as informações deste filme.
        </Text>
        <Button colorScheme="teal" onClick={() => navigate("/")}>
          Voltar para a busca
        </Button>
      </Box>
    );
  }

  const { movie, cast } = data;

  const currency = { style: "currency", currency: "BRL" };

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
  );
}
