import { useCallback, useEffect, useRef, useState } from "react";
import { AspectRatio, Box, Flex, IconButton, Image, Skeleton, Stack, Text } from "@chakra-ui/react";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";

export interface PosterCarouselItem {
  key: string;
  /** Texto abaixo da imagem; sem ele, só a imagem aparece. */
  title?: string;
  /** Nome acessível do card (padrão: o título). */
  ariaLabel?: string;
  subtitle?: string;
  imageUrl: string;
  onClick: () => void;
}

interface Props {
  items: PosterCarouselItem[];
  label: string;
  /** Proporção da imagem (padrão: pôster 2:3). */
  ratio?: number;
  /** Largura de cada card. */
  itemWidth?: { base: string; md: string };
}

const POSTER_WIDTH = { base: "130px", md: "160px" };

/** Placeholder da faixa de pôsteres enquanto os dados carregam. */
export function PosterCarouselSkeleton({ count = 6 }: { count?: number }) {
  return (
    <Stack direction="row" spacing={4} overflow="hidden" aria-busy="true">
      {Array.from({ length: count }, (_, i) => (
        <Skeleton key={i} w={POSTER_WIDTH} h={{ base: "195px", md: "240px" }} borderRadius="lg" flexShrink={0} />
      ))}
    </Stack>
  );
}

/** Faixa horizontal de cards com pôster, rolável por setas ou toque. */
export default function PosterCarousel({
  items,
  label,
  ratio = 2 / 3,
  itemWidth = POSTER_WIDTH,
}: Props) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateArrows = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  }, []);

  // Recalcula as setas quando o tamanho da faixa muda (inclusive na primeira medição).
  useEffect(() => {
    const el = trackRef.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(updateArrows);
    observer.observe(el);
    return () => observer.disconnect();
  }, [items, updateArrows]);

  const scroll = (direction: 1 | -1) => {
    const el = trackRef.current;
    el?.scrollBy({ left: direction * el.clientWidth * 0.8, behavior: "smooth" });
  };

  // Sem nada para rolar (poucos itens), as setas somem mas mantêm o espaço.
  const hasOverflow = canScrollLeft || canScrollRight;
  const arrowProps = {
    isRound: true,
    visibility: hasOverflow ? ("visible" as const) : ("hidden" as const),
    variant: "outline",
    bg: "bg.surface",
    flexShrink: 0,
    display: { base: "none", md: "inline-flex" },
  };

  return (
    <Flex align="center" gap={2} role="region" aria-label={label}>
      <IconButton
        {...arrowProps}
        aria-label="Rolar para a esquerda"
        icon={<ChevronLeftIcon boxSize={6} />}
        isDisabled={!canScrollLeft}
        onClick={() => scroll(-1)}
      />

      <Flex
        ref={trackRef}
        as="ul"
        listStyleType="none"
        flex="1"
        minW={0}
        gap={4}
        overflowX="auto"
        py={2}
        px={1}
        scrollSnapType="x mandatory"
        onScroll={updateArrows}
        sx={{ scrollbarWidth: "none", "&::-webkit-scrollbar": { display: "none" } }}
      >
        {items.map((item) => (
          <Box as="li" key={item.key} flexShrink={0} w={itemWidth} scrollSnapAlign="start">
            <Box
              as="button"
              type="button"
              onClick={item.onClick}
              aria-label={item.ariaLabel}
              w="100%"
              textAlign="left"
              borderRadius="lg"
              transition="transform 0.2s"
              _hover={{ transform: "translateY(-4px)" }}
              _focusVisible={{ outline: "2px solid", outlineColor: "red.400", outlineOffset: "2px" }}
            >
              <AspectRatio ratio={ratio} mb={item.title ? 2 : 0}>
                <Image
                  src={item.imageUrl}
                  alt=""
                  objectFit="cover"
                  borderRadius="lg"
                  boxShadow="md"
                  loading="lazy"
                />
              </AspectRatio>
              {item.title && (
                <Text fontWeight="semibold" fontSize="sm" noOfLines={2}>
                  {item.title}
                </Text>
              )}
              {item.subtitle && (
                <Text fontSize="xs" color="text.muted" noOfLines={1}>
                  {item.subtitle}
                </Text>
              )}
            </Box>
          </Box>
        ))}
      </Flex>

      <IconButton
        {...arrowProps}
        aria-label="Rolar para a direita"
        icon={<ChevronRightIcon boxSize={6} />}
        isDisabled={!canScrollRight}
        onClick={() => scroll(1)}
      />
    </Flex>
  );
}
