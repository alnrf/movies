import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getActorDetail,
  getActorMovies,
  getActorTv,
  getActorImages,
} from "../api/tmdbService";
import { getProfileUrl } from "../utils/tmdbImage";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Box,
  Image,
  Text,
  Heading,
  Stack,
  Divider,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Badge,
  Flex,
  IconButton,
  Icon,
} from "@chakra-ui/react";
import {
  ExternalLinkIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@chakra-ui/icons";
import { MdMovie, MdTv, MdInfoOutline, MdPhotoLibrary } from "react-icons/md";
import { getYearFromDate, formatDate, calculateAgeDetailed } from "../utils/date";
import { useSortByDate } from "../hooks/useSortByDate";
import type { Person, PersonMovieCredit, PersonTvCredit, PersonImage } from "../types/Person";

interface Props {
  actorId: number;
  open: boolean;
  onClose: () => void;
}

export default function ActorModal({ actorId, open, onClose }: Props) {
  const navigate = useNavigate();
  const [actor, setActor] = useState<Person | null>(null);
  const [movies, setMovies] = useState<PersonMovieCredit[]>([]);
  const [tv, setTv] = useState<PersonTvCredit[]>([]);
  const [photos, setPhotos] = useState<PersonImage[]>([]);
  const [photoIndex, setPhotoIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!open) return;

    document.body.style.overflow = "hidden";

    async function fetchData() {
      try {
        const [detail, credits, tvCredits, images] = await Promise.all([
          getActorDetail(actorId),
          getActorMovies(actorId),
          getActorTv(actorId),
          getActorImages(actorId),
        ]);

        setActor(detail.data);
        setMovies(credits.data.cast);
        setTv(tvCredits.data.cast);
        setPhotos(images.data.profiles ?? []);
      } finally {
        setLoading(false);
      }
    }

    fetchData();

    return () => {
      document.body.style.overflow = "";
      setLoading(true);
      setActor(null);
      setMovies([]);
      setTv([]);
      setPhotos([]);
      setPhotoIndex(0);
    };
  }, [actorId, open]);

  const showPhoto = (index: number) => {
    // Volta ao início/fim ao passar da última/primeira foto
    setPhotoIndex((index + photos.length) % photos.length);
  };

  const birthYear = getYearFromDate(actor?.birthday);

  const ageNow = actor?.birthday
    ? calculateAgeDetailed(actor.birthday, actor?.deathday)
    : "—";

  const sortedMovies = useSortByDate(movies, "release_date").filter(
    (t) => !t.character?.toLowerCase().startsWith("self"),
  );
  const sortedTv = useSortByDate(tv, "first_air_date").filter(
    (t) => !t.character?.toLowerCase().startsWith("self"),
  );

  return (
    <Modal
      isOpen={open}
      onClose={onClose}
      size="6xl"
      scrollBehavior="inside"
      isCentered
    >
      <ModalOverlay />

      <ModalContent maxH="90vh">
        <ModalHeader>Detalhes do ator</ModalHeader>
        <ModalCloseButton />

        <ModalBody>
          {loading && <Text>Carregando...</Text>}

          {!loading && actor && (
            <Stack
              direction={{ base: "column", md: "row" }}
              spacing={6}
              align="stretch"
              height="100%"
            >
              {/* COLUNA ESQUERDA — FOTO + DADOS */}
              <Box
                flexShrink={0}
                w={{ base: "100%", md: "260px" }}
                textAlign="center"
              >
                <Image
                  src={getProfileUrl(actor.profile_path, "MEDIUM")}
                  alt={actor.name}
                  borderRadius="md"
                  mb={4}
                  mx="auto"
                  maxW={{ base: "160px", md: "220px" }}
                />

                <Heading size="md">{actor.name}</Heading>

                <Flex direction="column" gap={3} mt={4}>
                  <Flex direction="row" textAlign="center" gap={2}>
                    <Text fontWeight="semibold">Nascimento:</Text>
                    <Text fontSize="md" whiteSpace="nowrap">
                      {formatDate(actor.birthday) || "—"}
                    </Text>
                  </Flex>
                  {actor.deathday && (
                    <Flex direction="row" textAlign="center" gap={2}>
                      <Text fontWeight="semibold">Falecimento:</Text>
                      <Text fontSize="md" whiteSpace="nowrap">
                        {formatDate(actor.deathday) || "—"}
                      </Text>
                    </Flex>
                  )}
                  <Flex direction="row" textAlign="center" gap={2}>
                    <Text fontWeight="semibold">Idade:</Text>
                    <Text fontSize="md">{ageNow}</Text>
                  </Flex>
                </Flex>
              </Box>

              {/* COLUNA DIREITA — TABS */}
              <Box flex="1" display="flex" flexDirection="column">
                <Tabs
                  variant="enclosed"
                  colorScheme="blue"
                  display="flex"
                  flexDirection="column"
                  height="100%"
                >
                  <TabList>
                    <Tab gap={2}><Icon as={MdMovie} />Filmes</Tab>
                    <Tab gap={2}><Icon as={MdTv} />Seriados</Tab>
                    <Tab gap={2}><Icon as={MdInfoOutline} />Informações</Tab>
                    <Tab gap={2}><Icon as={MdPhotoLibrary} />Fotos</Tab>
                  </TabList>

                  <TabPanels flex="1" overflow="hidden">
                    {/* FILMES */}
                    <TabPanel
                      px={0}
                      pt={4}
                      overflowY="auto"
                      maxH={{ base: "auto", md: "calc(90vh - 220px)" }}
                    >
                      {sortedMovies.length === 0 ? (
                        <Text color="text.muted">Nenhum filme encontrado.</Text>
                      ) : (
                        <Stack spacing={3}>
                          {sortedMovies.map((m) => {
                            const year = m.release_date
                              ? new Date(m.release_date).getFullYear()
                              : "—";

                            return (
                              <Box key={m.id}>
                                <Stack direction="row" align="center" spacing={2}>
                                  <Text fontWeight="semibold">
                                    {m.title} ({year})
                                  </Text>
                                  <Badge colorScheme="blue">Filme</Badge>
                                  <IconButton
                                    aria-label="Ver detalhes do filme"
                                    icon={<ExternalLinkIcon />}
                                    size="xs"
                                    variant="ghost"
                                    onClick={() => { onClose(); navigate(`/movie/${m.id}`); }}
                                  />
                                </Stack>
                                {m.original_title !== m.title && (
                                  <Text fontSize="sm" color="text.secondary">
                                    {m.original_title}
                                  </Text>
                                )}
                                <Text fontSize="sm" color="text.secondary">
                                  {m.character}
                                </Text>
                                <Flex direction="row" align="center" gap={2}>
                                  <Text fontSize="sm" color="text.secondary">Idade:</Text>
                                  <Text fontSize="sm" color="text.secondary">
                                    {year && birthYear && typeof year === "number" && typeof birthYear === "number"
                                      ? year - birthYear
                                      : "—"}{" "}
                                    anos
                                  </Text>
                                </Flex>
                                <Divider mt={2} />
                              </Box>
                            );
                          })}
                        </Stack>
                      )}
                    </TabPanel>

                    {/* SERIADOS */}
                    <TabPanel
                      px={0}
                      pt={4}
                      overflowY="auto"
                      maxH="calc(90vh - 200px)"
                    >
                      {sortedTv.length === 0 ? (
                        <Text color="text.muted">Nenhum programa de TV encontrado.</Text>
                      ) : (
                        <Stack spacing={3}>
                          {sortedTv.map((t) => {
                            const year = t.first_air_date
                              ? new Date(t.first_air_date).getFullYear()
                              : "—";

                            return (
                              <Box key={t.id}>
                                <Stack direction="row" align="center" spacing={2}>
                                  <Text fontWeight="semibold">
                                    {t.name} ({year})
                                  </Text>
                                  <Badge colorScheme="purple">TV</Badge>
                                  <IconButton
                                    aria-label="Ver detalhes do seriado"
                                    icon={<ExternalLinkIcon />}
                                    size="xs"
                                    variant="ghost"
                                    onClick={() => { onClose(); navigate(`/tv/${t.id}`); }}
                                  />
                                </Stack>
                                {t.name !== t.original_name && (
                                  <Text fontSize="sm" color="text.secondary">
                                    {t.original_name}
                                  </Text>
                                )}
                                <Stack direction="row" align="center" spacing={2}>
                                  <Text fontSize="sm" color="text.secondary">
                                    {t.character}
                                  </Text>
                                  {t.episode_count && (
                                    <Text fontSize="sm" color="text.secondary">
                                      - Episódios: {t.episode_count}
                                    </Text>
                                  )}
                                </Stack>
                                <Flex direction="row" align="center" gap={2}>
                                  <Text fontSize="sm" color="text.secondary">
                                    Idade:{" "}
                                    {birthYear && typeof year === "number"
                                      ? year - birthYear
                                      : "—"}{" "}
                                    anos
                                  </Text>
                                </Flex>
                                <Divider mt={2} />
                              </Box>
                            );
                          })}
                        </Stack>
                      )}
                    </TabPanel>

                    {/* INFORMAÇÕES */}
                    <TabPanel
                      px={0}
                      pt={4}
                      overflowY="auto"
                      maxH="calc(90vh - 200px)"
                    >
                      <Stack spacing={4}>
                        {actor.place_of_birth && (
                          <Box>
                            <Text fontWeight="semibold" mb={1}>Local de nascimento</Text>
                            <Text>{actor.place_of_birth}</Text>
                          </Box>
                        )}
                        {actor.birthday && (
                          <Box>
                            <Text fontWeight="semibold" mb={1}>Nascimento</Text>
                            <Text>{formatDate(actor.birthday)}</Text>
                          </Box>
                        )}
                        {actor.deathday && (
                          <Box>
                            <Text fontWeight="semibold" mb={1}>Falecimento</Text>
                            <Text>{formatDate(actor.deathday)}</Text>
                          </Box>
                        )}
                        {actor.biography ? (
                          <Box>
                            <Text fontWeight="semibold" mb={1}>Biografia</Text>
                            <Text whiteSpace="pre-line">{actor.biography}</Text>
                          </Box>
                        ) : (
                          <Text color="text.muted">Biografia não disponível.</Text>
                        )}
                      </Stack>
                    </TabPanel>

                    {/* FOTOS */}
                    <TabPanel
                      px={0}
                      pt={4}
                      overflow="hidden"
                    >
                      {photos.length === 0 ? (
                        <Text color="text.muted">Nenhuma foto disponível.</Text>
                      ) : (
                        <Stack spacing={2} align="center">
                          {/* CARROSSEL */}
                          <Flex align="center" gap={2} w="100%">
                            <IconButton
                              aria-label="Foto anterior"
                              icon={<ChevronLeftIcon boxSize={8} />}
                              variant="ghost"
                              size="lg"
                              flexShrink={0}
                              isDisabled={photos.length < 2}
                              onClick={() => showPhoto(photoIndex - 1)}
                            />
                            <Flex
                              flex="1"
                              minW={0}
                              justify="center"
                              h={{ base: "60vh", md: "calc(90vh - 260px)" }}
                            >
                              <Image
                                key={photos[photoIndex].file_path}
                                src={getProfileUrl(photos[photoIndex].file_path, "LARGE")}
                                alt={`Foto ${photoIndex + 1} de ${actor.name}`}
                                h="100%"
                                maxW="100%"
                                objectFit="contain"
                                borderRadius="md"
                              />
                            </Flex>
                            <IconButton
                              aria-label="Próxima foto"
                              icon={<ChevronRightIcon boxSize={8} />}
                              variant="ghost"
                              size="lg"
                              flexShrink={0}
                              isDisabled={photos.length < 2}
                              onClick={() => showPhoto(photoIndex + 1)}
                            />
                          </Flex>
                          <Text fontSize="sm" color="text.muted">
                            {photoIndex + 1} / {photos.length}
                          </Text>
                        </Stack>
                      )}
                    </TabPanel>
                  </TabPanels>
                </Tabs>
              </Box>
            </Stack>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
