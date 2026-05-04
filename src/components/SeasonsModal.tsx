import { useState, useEffect } from "react";
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Box,
  HStack,
  Button,
  Divider,
  Text,
  Stack,
  Image,
  Flex,
} from "@chakra-ui/react";
import { getTvSeasonDetails } from "../api/tmdbService";
import { getBackdropUrl } from "../utils/tmdbImage";
import { formatDate } from "../utils/date";

interface SeasonsModalProps {
  isOpen: boolean;
  onClose: () => void;
  tvId: number;
  seasons?: number;
  onEpisodeSelect: (seasonNumber: number, episodeNumber: number) => void;
}

const SeasonsModal = ({
  isOpen,
  onClose,
  tvId,
  seasons,
  onEpisodeSelect,
}: SeasonsModalProps) => {
  const [selectedSeason, setSelectedSeason] = useState<number | null>(null);
  const [seasonData, setSeasonData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedSeason) {
      setLoading(true);
      getTvSeasonDetails(tvId, selectedSeason)
        .then((res) => {
          setSeasonData(res.data);
          setLoading(false);
        })
        .catch(() => {
          setLoading(false);
        });
    } else {
      setSeasonData(null);
    }
  }, [selectedSeason, tvId]);

  const handleSeasonClick = (season: number) => {
    setSelectedSeason(season);
  };

  const handleBack = () => {
    setSelectedSeason(null);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="6xl"
      scrollBehavior="inside"
      isCentered
    >
      <ModalOverlay />
      <ModalContent maxH="90vh">
        <ModalHeader>Detalhes das Temporadas</ModalHeader>
        <ModalCloseButton />

        <ModalBody>
          <>
            <Box overflowX="auto" whiteSpace="nowrap" p={4}>
              <HStack spacing={4}>
                {seasons &&
                  Array.from({ length: seasons }, (_, i) => i + 1).map(
                    (season) => (
                      <Button
                        key={season}
                        variant="outline"
                        size="sm"
                        onClick={() => handleSeasonClick(season)}
                      >
                        {season}
                      </Button>
                    ),
                  )}
              </HStack>
            </Box>
          </>
          <Divider mt={4} mb={4} />
          <>
            {loading && <Text>Carregando...</Text>}
            {!loading && seasonData && (
              <>
                <Text fontSize="2xl" mb={4}>
                  Temporada {selectedSeason}
                </Text>
                <Stack
                  direction={{ base: "column", md: "row" }}
                  spacing={6}
                  align="flex-start"
                  padding={4}
                >
                  {seasonData.poster_path && (
                    <Image
                      src={getBackdropUrl(seasonData.poster_path, "XSMALL")}
                      borderRadius="md"
                      maxW={{ base: "100%", md: "420px" }}
                      objectFit="cover"
                    />
                  )}
                  <Text mb={4}>
                    {seasonData.overview || "Sem resumo disponível."}
                  </Text>
                </Stack>
                <Box overflowY="auto" maxH="60vh">
                  <Stack spacing={2}>
                    {seasonData.episodes.map((episode: any) => (
                      <Box
                        key={episode.id}
                        p={2}
                        border="1px"
                        borderRadius="md"
                      >
                        <Stack
                          direction={{ base: "column", md: "row" }}
                          spacing={6}
                          align="flex-start"
                          padding={2}
                        >
                          {episode.still_path && (
                            <Image
                              src={getBackdropUrl(episode.still_path, "SMALL")}
                              alt={episode.name}
                              borderRadius="md"
                              maxW={{ base: "100%", md: "420px" }}
                              objectFit="cover"
                            />
                          )}
                          <Box gap={2}>
                            <Text fontWeight="bold" mb={2}>
                              {episode.name} (Episódio {episode.episode_number})
                            </Text>
                            <Text fontSize="sm" mb={2}>
                              {episode.overview || "Sem descrição."}
                            </Text>
                            <Flex direction="row" gap={2} mb={2}>
                              <Text fontWeight="bold">Exibido em:</Text>
                              <Text fontWeight="normal">
                                {formatDate(episode.air_date)}
                              </Text>
                            </Flex>
                            <Button
                              size="sm"
                              onClick={() =>
                                onEpisodeSelect(
                                  selectedSeason!,
                                  episode.episode_number,
                                )
                              }
                            >
                              Ver Detalhes
                            </Button>
                          </Box>
                        </Stack>
                      </Box>
                    ))}
                  </Stack>
                </Box>
                <Button mt={4} onClick={handleBack}>
                  Voltar
                </Button>
              </>
            )}
          </>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default SeasonsModal;
