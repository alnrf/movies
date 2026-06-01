import { useEffect, useRef, useState } from "react";
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
} from "@chakra-ui/react";
import {
  ExternalLinkIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@chakra-ui/icons";
import { getYearFromDate, formatDate, calculateAgeDetailed } from "../utils/date";
import { useSortByDate } from "../hooks/useSortByDate";

interface Props {
  actorId: number;
  open: boolean;
  onClose: () => void;
}

export default function ActorModal({ actorId, open, onClose }: Props) {
  const navigate = useNavigate();
  const [actor, setActor] = useState<any>(null);
  const [movies, setMovies] = useState<any[]>([]);
  const [tv, setTv] = useState<any[]>([]);
  const [photos, setPhotos] = useState<any[]>([]);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

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
      setSelectedPhoto(null);
    };
  }, [actorId, open]);

  const updateScrollState = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  };

  useEffect(() => {
    if (photos.length > 0) {
      setTimeout(updateScrollState, 50);
    }
  }, [photos]);

  const birthYear = getYearFromDate(actor?.birthday);

  const ageNow = actor?.birthday
    ? calculateAgeDetailed(actor.birthday, actor?.deathday)
    : "—";

  const sortedMovies = useSortByDate(movies, "release_date");
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
                    <Tab>Filmes</Tab>
                    <Tab>Seriados</Tab>
                    <Tab>Informações</Tab>
                    <Tab>Fotos</Tab>
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
                        <Text color="gray.500">Nenhum filme encontrado.</Text>
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
                                  <Text fontSize="sm" color="gray.600">
                                    {m.original_title}
                                  </Text>
                                )}
                                <Text fontSize="sm" color="gray.600">
                                  {m.character}
                                </Text>
                                <Flex direction="row" align="center" gap={2}>
                                  <Text fontSize="sm" color="gray.600">Idade:</Text>
                                  <Text fontSize="sm" color="gray.600">
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
                        <Text color="gray.500">Nenhum programa de TV encontrado.</Text>
                      ) : (
                        <Stack spacing={3}>
                          {sortedTv.map((t) => {
                            const year = t.first_air_date
                              ? new Date(t.first_air_date).getFullYear()
                              : "—";
                            const creditYear = t.first_credit_air_date
                              ? new Date(t.first_credit_air_date).getFullYear()
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
                                  <Text fontSize="sm" color="gray.600">
                                    {t.original_name}
                                  </Text>
                                )}
                                <Stack direction="row" align="center" spacing={2}>
                                  <Text fontSize="sm" color="gray.600">
                                    {t.character}
                                  </Text>
                                  {t.episode_count && (
                                    <Text fontSize="sm" color="gray.600">
                                      - Episódios: {t.episode_count}
                                    </Text>
                                  )}
                                </Stack>
                                <Flex direction="row" align="center" gap={2}>
                                  <Text fontSize="sm" color="gray.600">
                                    Idade:{" "}
                                    {creditYear && birthYear && typeof creditYear === "number" && typeof birthYear === "number"
                                      ? creditYear - birthYear
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
                          <Text color="gray.500">Biografia não disponível.</Text>
                        )}
                      </Stack>
                    </TabPanel>

                    {/* FOTOS */}
                    <TabPanel
                      px={0}
                      pt={4}
                      overflowY="auto"
                      maxH="calc(90vh - 200px)"
                    >
                      {photos.length === 0 ? (
                        <Text color="gray.500">Nenhuma foto disponível.</Text>
                      ) : (
                        <Stack spacing={4}>
                          {/* CARROSSEL DE MINIATURAS */}
                          <Flex align="center" gap={2}>
                            {canScrollLeft && (
                              <IconButton
                                aria-label="Rolar para esquerda"
                                icon={<ChevronLeftIcon boxSize={5} />}
                                size="sm"
                                variant="ghost"
                                flexShrink={0}
                                onClick={() => {
                                  scrollRef.current?.scrollBy({ left: -240, behavior: "smooth" });
                                  setTimeout(updateScrollState, 300);
                                }}
                              />
                            )}
                            <Box
                              ref={scrollRef}
                              display="flex"
                              flexDirection="row"
                              gap={2}
                              overflowX="hidden"
                              flex="1"
                              onScroll={updateScrollState}
                            >
                              {photos.map((photo: any) => (
                                <Image
                                  key={photo.file_path}
                                  src={getProfileUrl(photo.file_path, "SMALL")}
                                  alt="Foto do ator"
                                  h="100px"
                                  w="auto"
                                  flexShrink={0}
                                  borderRadius="md"
                                  cursor="pointer"
                                  opacity={selectedPhoto === photo.file_path ? 1 : 0.75}
                                  outline={selectedPhoto === photo.file_path ? "3px solid" : "none"}
                                  outlineColor="blue.400"
                                  _hover={{ opacity: 1 }}
                                  onClick={() => setSelectedPhoto(photo.file_path)}
                                />
                              ))}
                            </Box>
                            {canScrollRight && (
                              <IconButton
                                aria-label="Rolar para direita"
                                icon={<ChevronRightIcon boxSize={5} />}
                                size="sm"
                                variant="ghost"
                                flexShrink={0}
                                onClick={() => {
                                  scrollRef.current?.scrollBy({ left: 240, behavior: "smooth" });
                                  setTimeout(updateScrollState, 300);
                                }}
                              />
                            )}
                          </Flex>

                          {/* PREVIEW DA FOTO SELECIONADA */}
                          {selectedPhoto && (
                            <Flex justify="center">
                              <Image
                                src={getProfileUrl(selectedPhoto, "LARGE")}
                                alt="Foto ampliada"
                                maxH="480px"
                                borderRadius="md"
                                objectFit="contain"
                              />
                            </Flex>
                          )}
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
