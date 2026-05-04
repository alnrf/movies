import { useEffect, useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Text,
  Divider,
  Heading,
  Grid,
  Box,
} from "@chakra-ui/react";
import { getTvEpisodeDetails } from "../api/tmdbService";
import { formatDate } from "../utils/date";
import CastCard from "./CastCard";

interface EpisodeDetailModalProps {
  tvId: number;
  seasonNumber: number;
  episodeNumber: number;
  isOpen: boolean;
  onClose: () => void;
}

const EpisodeDetailModal = ({
  tvId,
  seasonNumber,
  episodeNumber,
  isOpen,
  onClose,
}: EpisodeDetailModalProps) => {
  const [episode, setEpisode] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isOpen) return;

    async function fetchEpisode() {
      try {
        const res = await getTvEpisodeDetails(tvId, seasonNumber, episodeNumber);
        setEpisode(res.data);
      } finally {
        setLoading(false);
      }
    }

    fetchEpisode();
  }, [tvId, seasonNumber, episodeNumber, isOpen]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="6xl" scrollBehavior="inside">
      <ModalOverlay />
      <ModalContent maxH="90vh">
        <ModalHeader>Detalhes do Episódio {episodeNumber}</ModalHeader>
        <ModalCloseButton />
        <ModalBody p={6}>
          {loading && <Text>Carregando...</Text>}
          {!loading && episode && (
            <Box overflowY="auto" maxH="65vh">
              <Text fontWeight="bold" mb={2}>
                {episode.name}
              </Text>
              <Text mb={4}>{episode.overview || "Sem descrição."}</Text>
              <Text>Data de exibição: {formatDate(episode.air_date)}</Text>
              <Divider mt={3} />
              <Heading as="h3" size="md" mb={3} mt={6}>
                Elenco
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
                {episode.guest_stars?.map((actor: any) => (
                  <CastCard key={actor.id} actor={actor} />
                ))}
              </Grid>
            </Box>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default EpisodeDetailModal;