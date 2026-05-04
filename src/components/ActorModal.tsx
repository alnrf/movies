import { useEffect, useState } from "react";
import { getActorDetail, getActorMovies, getActorTv } from "../api/tmdbService";
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
} from "@chakra-ui/react";
import { getYearFromDate, formatDate, calculateAgeDetailed } from "../utils/date";
import { useSortByDate } from "../hooks/useSortByDate";

interface Props {
  actorId: number;
  open: boolean;
  onClose: () => void;
}

export default function ActorModal({
  actorId,
  open,
  onClose,
}: Props) {
  const [actor, setActor] = useState<any>(null);
  const [movies, setMovies] = useState<any[]>([]);
  const [tv, setTv] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!open) return;

    document.body.style.overflow = "hidden";

    async function fetchData() {
      try {
        const [detail, credits, tvCredits] = await Promise.all([
          getActorDetail(actorId),
          getActorMovies(actorId),
          getActorTv(actorId),
        ]);

        setActor(detail.data);
        setMovies(credits.data.cast);
        setTv(tvCredits.data.cast);
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
    };
  }, [actorId, open]);

  const birthYear = getYearFromDate(actor?.birthday);

  let ageNow: string = "—";

  if (actor?.birthday) {
    ageNow = calculateAgeDetailed(actor.birthday, actor?.deathday);
  }

  const sortedMovies = useSortByDate(movies, "release_date");
  const sortedTv = useSortByDate(tv, "first_air_date");

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

                <Flex direction="column" 
                  gap={3}
                  mt={4}
                >
                  <Flex direction="row" textAlign="center" gap={2}>
                    <Text fontWeight="semibold">Nascimento:</Text>
                    <Text fontSize="md" whiteSpace="nowrap">
                      {formatDate(actor.birthday) || "—"}
                    </Text>
                  </Flex>
                 { actor.deathday && (
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
              <Box
                flex="1"
                display="flex"
                flexDirection="column"
                minH={{ base: "auto", md: "0" }}
              >
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
                                <Stack
                                  direction="row"
                                  align="center"
                                  spacing={2}
                                >
                                  <Text fontWeight="semibold">
                                    {m.title} ({year})
                                  </Text>

                                  <Badge colorScheme="blue">Filme</Badge>
                                </Stack>

                            { m.original_title  !== m.title && <Text fontSize="sm" color="gray.600">
                                  {m.original_title}
                                </Text>}
                                <Text fontSize="sm" color="gray.600">
                                  {m.character}
                                </Text>
                                <Flex direction="row" align="center" gap={2}>
                                   <Text fontSize="sm" color="gray.600">
                                  Idade:
                                </Text>
                                  <Text fontSize="sm" color="gray.600">
                                  {year && birthYear && typeof year === "number" && typeof birthYear === "number" ? year - birthYear : "—"} anos
                                </Text>
                              </Flex>

                                <Divider mt={2} />
                              </Box>
                            );
                          })}
                        </Stack>
                      )}
                    </TabPanel>

                    {/* TV SHOWS */}
                    <TabPanel
                      px={0}
                      pt={4}
                      overflowY="auto"
                      maxH="calc(90vh - 200px)"
                    >
                      {sortedTv.length === 0 ? (
                        <Text color="gray.500">
                          Nenhum programa de TV encontrado.
                        </Text>
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
                                <Stack
                                  direction="row"
                                  align="center"
                                  spacing={2}
                                >
                                  <Text fontWeight="semibold">
                                    {t.name} ({year})
                                  </Text>

                                  <Badge colorScheme="purple">TV</Badge>
                                </Stack>
                                {t.name !== t.original_name && (
                                  <Text fontSize="sm" color="gray.600">
                                    {t.original_name}
                                  </Text>
                                )}
                                <Stack
                                  direction="row"
                                  align="center"
                                  spacing={2}>

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
                                  Idade: {creditYear && birthYear && typeof creditYear === "number" && typeof birthYear === "number" ? creditYear - birthYear : "—"} anos
                                </Text>
                                </Flex>

                                <Divider mt={2} />
                              </Box>
                            );
                          })}
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
