import { useQuery } from "@tanstack/react-query";
import { Box, Flex, Heading, Image, Link, Spinner, Stack, Text, Wrap, WrapItem } from "@chakra-ui/react";
import { getMovieWatchProviders, getTvWatchProviders } from "../api/tmdbService";
import { getProviderLogoUrl } from "../utils/tmdbImage";
import { TMDB_REGION } from "../config/tmdb";
import type { WatchProvider, WatchProvidersResponse } from "../types/WatchProviders";

interface Props {
  mediaType: "movie" | "tv";
  id: number;
}

const SECTIONS: { key: "flatrate" | "rent" | "buy"; label: string }[] = [
  { key: "flatrate", label: "Stream" },
  { key: "rent", label: "Locação" },
  { key: "buy", label: "Compra" },
];

function ProviderList({ providers }: { providers: WatchProvider[] }) {
  return (
    <Wrap spacing={2}>
      {providers.map((provider) => (
        <WrapItem key={provider.provider_id}>
          <Image
            src={getProviderLogoUrl(provider.logo_path)}
            alt={provider.provider_name}
            title={provider.provider_name}
            borderRadius="md"
            boxSize="40px"
          />
        </WrapItem>
      ))}
    </Wrap>
  );
}

export default function WatchProviders({ mediaType, id }: Props) {
  const region = TMDB_REGION;

  const { data, isLoading } = useQuery({
    queryKey: ["watchProviders", mediaType, id],
    queryFn: () =>
      (mediaType === "movie"
        ? getMovieWatchProviders(id)
        : getTvWatchProviders(id)
      ).then((res) => res.data as WatchProvidersResponse),
  });

  const countryData = data?.results?.[region] ?? data?.results?.BR;
  const hasAny = SECTIONS.some((section) => countryData?.[section.key]?.length);

  return (
    <Box borderWidth="1px" borderRadius="md" p={4}>
      <Heading size="sm" mb={3}>
        Onde assistir
      </Heading>

      {isLoading && <Spinner size="sm" />}

      {!isLoading && !hasAny && (
        <Text fontSize="sm" color="text.muted">
          Nenhuma informação de streaming disponível.
        </Text>
      )}

      {!isLoading && hasAny && (
        <Stack spacing={4}>
          <Flex direction="row" gap={4}>
            {SECTIONS.map(({ key, label }) => {
              const providers = countryData?.[key];
              if (!providers || providers.length === 0) return null;

              return (
                <Box key={key} flex="1" minW={0}>
                  <Text fontWeight="semibold" fontSize="sm" mb={2}>
                    {label}
                  </Text>
                  <ProviderList providers={providers} />
                </Box>
              );
            })}
          </Flex>

          {countryData?.link && (
            <Link href={countryData.link} isExternal fontSize="xs" color="blue.500">
              Ver mais no TMDB
            </Link>
          )}
        </Stack>
      )}
    </Box>
  );
}
