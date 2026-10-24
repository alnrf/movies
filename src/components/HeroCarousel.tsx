import { useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { Box, Flex, Heading, IconButton, Image, Link, Text } from "@chakra-ui/react";
import { ChevronLeftIcon, ChevronRightIcon, StarIcon } from "@chakra-ui/icons";
import { getBackdropUrl } from "../utils/tmdbImage";
import { getYearFromDate } from "../utils/date";
import type { MovieListItem } from "../types/Movie";

const AUTOPLAY_MS = 6000;

interface Props {
  movies: MovieListItem[];
  label: string;
}

/** Carrossel de destaque com a imagem de fundo dos filmes e troca automática. */
export default function HeroCarousel({ movies, label }: Props) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = movies.length;

  const goTo = (i: number) => setIndex(((i % count) + count) % count);

  // Avança sozinho; o timer reinicia a cada troca (manual ou automática).
  useEffect(() => {
    if (paused || count < 2) return;
    const timer = setTimeout(() => setIndex((i) => (i + 1) % count), AUTOPLAY_MS);
    return () => clearTimeout(timer);
  }, [index, paused, count]);

  if (count === 0) return null;

  const arrowProps = {
    position: "absolute" as const,
    top: "50%",
    transform: "translateY(-50%)",
    isRound: true,
    color: "gray.800",
    boxSize: { base: 8, md: 10 },
    minW: 0,
    bg: "whiteAlpha.800",
    _hover: { bg: "white" },
    zIndex: 1,
  };

  return (
    <Box
      as="section"
      aria-roledescription="carrossel"
      aria-label={label}
      position="relative"
      h={{ base: "220px", md: "380px" }}
      borderRadius="2xl"
      overflow="hidden"
      bg="gray.800"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <Flex
        h="100%"
        transform={`translateX(-${index * 100}%)`}
        transition="transform 0.6s ease"
        sx={{ "@media (prefers-reduced-motion: reduce)": { transition: "none" } }}
      >
        {movies.map((movie, i) => {
          const current = i === index;
          const year = getYearFromDate(movie.release_date);
          return (
            <Link
              key={movie.id}
              as={RouterLink}
              to={`/movie/${movie.id}`}
              aria-hidden={!current}
              tabIndex={current ? 0 : -1}
              aria-label={`${movie.title}: ver detalhes`}
              flex="0 0 100%"
              h="100%"
              position="relative"
              display="block"
              _hover={{ textDecoration: "none" }}
            >
              <Image
                src={getBackdropUrl(movie.backdrop_path, "LARGE")}
                alt=""
                w="100%"
                h="100%"
                objectFit="cover"
                loading={i === 0 ? "eager" : "lazy"}
              />
              <Box
                position="absolute"
                inset={0}
                bgGradient="linear(to-tr, blackAlpha.800 10%, blackAlpha.300 55%, transparent)"
              />
              <Box
                position="absolute"
                left={{ base: 12, md: 20 }}
                right={{ base: 12, md: "40%" }}
                bottom={{ base: 6, md: 10 }}
                color="white"
              >
                <Flex gap={3} align="center" fontSize="sm" mb={2} color="whiteAlpha.900">
                  <Flex
                    align="center"
                    gap={1}
                    bg="blackAlpha.500"
                    px={2}
                    py={0.5}
                    borderRadius="full"
                  >
                    <StarIcon boxSize={3} color="yellow.400" />
                    {movie.vote_average.toFixed(1)}
                  </Flex>
                  {year && <Text>{year}</Text>}
                </Flex>
                <Heading size={{ base: "md", md: "xl" }} noOfLines={2} mb={2}>
                  {movie.title}
                </Heading>
                <Text
                  display={{ base: "none", md: "-webkit-box" }}
                  noOfLines={2}
                  fontSize="sm"
                  color="whiteAlpha.800"
                  mb={4}
                >
                  {movie.overview}
                </Text>
                <Box
                  display={{ base: "none", md: "inline-block" }}
                  bg="red.500"
                  px={5}
                  py={2}
                  borderRadius="lg"
                  fontWeight="semibold"
                  fontSize="sm"
                  boxShadow="0 6px 20px rgba(229, 62, 62, 0.45)"
                >
                  Ver detalhes
                </Box>
              </Box>
            </Link>
          );
        })}
      </Flex>

      {count > 1 && (
        <>
          <IconButton
            {...arrowProps}
            left={{ base: 2, md: 4 }}
            aria-label="Filme anterior"
            icon={<ChevronLeftIcon boxSize={6} />}
            onClick={() => goTo(index - 1)}
          />
          <IconButton
            {...arrowProps}
            right={{ base: 2, md: 4 }}
            aria-label="Próximo filme"
            icon={<ChevronRightIcon boxSize={6} />}
            onClick={() => goTo(index + 1)}
          />

          <Flex position="absolute" bottom={4} right={{ base: 5, md: 10 }} gap={1.5}>
            {movies.map((movie, i) => (
              <Box
                key={movie.id}
                as="button"
                type="button"
                aria-label={`Ir para ${movie.title}`}
                aria-current={i === index ? "true" : undefined}
                onClick={() => goTo(i)}
                h={2}
                w={i === index ? 6 : 2}
                borderRadius="full"
                bg={i === index ? "white" : "whiteAlpha.600"}
                transition="all 0.3s"
              />
            ))}
          </Flex>
        </>
      )}
    </Box>
  );
}
