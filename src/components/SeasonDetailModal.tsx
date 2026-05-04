import React, { useEffect, useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Text,
  Stack,
  Box,
  Button,
} from "@chakra-ui/react";
import { getTvSeasonDetails } from "../api/tmdbService";

interface SeasonDetailModalProps {
  tvId: number;
  seasonNumber: number;
  isOpen: boolean;
  onClose: () => void;
  onEpisodeSelect: (episodeNumber: number) => void;
}

const SeasonDetailModal = ({
  tvId,
  seasonNumber,
  isOpen,
  onClose,
  onEpisodeSelect,
}: SeasonDetailModalProps) => {
  const [season, setSeason] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isOpen) return;

    async function fetchSeason() {
      try {
        const res = await getTvSeasonDetails(tvId, seasonNumber);
        setSeason(res.data);
      } finally {
        setLoading(false);
      }
    }

    fetchSeason();
  }, [tvId, seasonNumber, isOpen]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="4xl" scrollBehavior="inside">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Detalhes da Temporada {seasonNumber}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {loading && <Text>Carregando...</Text>}
          {!loading && season && (
            <>
              <Text mb={4}>{season.overview || "Sem resumo disponível."}</Text>
              <Stack spacing={2}>
                {season.episodes.map((episode: any) => (
                  <Box key={episode.id} p={2} border="1px" borderRadius="md">
                    <Text fontWeight="bold">
                      {episode.name} (Episódio {episode.episode_number})
                    </Text>
                    <Text fontSize="sm">
                      {episode.overview || "Sem descrição."}
                    </Text>
                    <Button
                      size="sm"
                      onClick={() => onEpisodeSelect(episode.episode_number)}
                    >
                      Ver Detalhes
                    </Button>
                  </Box>
                ))}
              </Stack>
            </>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default SeasonDetailModal;