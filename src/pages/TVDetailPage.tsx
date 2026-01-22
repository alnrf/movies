import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getTvShowDetail, getCredits } from "../api/tmdbService";
import CastCard from "../components/CastCard";
import { format } from "date-fns";
import { getBackdropUrl } from "../utils/tmdbImage";
import { getYearFromDate } from "../utils/date";
import { Box, Grid, Heading, Image, Stack, Text } from "@chakra-ui/react";

export default function TVDetailPage() {
  const { id } = useParams();
  const [tv, setTv] = useState<any>(null);
  const [cast, setCast] = useState<any[]>([]);

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
    <Box maxW="1000px" mx="auto" p={4}>

       <Stack
              direction={{ base: "column", md: "row" }}
              spacing={6}
              align="flex-start"
            >
      {tv.backdrop_path && (
        <Image src={getBackdropUrl(tv.backdrop_path, "LARGE")} alt={tv.name} borderRadius="md"
          maxW={{ base: "100%", md: "420px" }}
          objectFit="cover"/>
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
      <Text>
        <Text as="span" fontWeight="semibold">
          Primeiro Episódio:
        </Text>{" "}
        {format(tv.first_air_date, "dd/MM/yyyy")}
      </Text>
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
              <CastCard key={actor.id} launchYear={launchYear} actor={actor} />
            ),
        )}
      </Grid>
    </Box>
  );
}
