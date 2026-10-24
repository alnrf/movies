import { useCallback, useEffect, useRef, useState } from "react";
import { AspectRatio, Box, Flex, IconButton, Image, Text } from "@chakra-ui/react";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";

export interface PosterCarouselItem {
  key: string;
  title: string;
  subtitle?: string;
  imageUrl: string;
  onClick: () => void;
}

interface Props {
  items: PosterCarouselItem[];
  label: string;
}

/** Faixa horizontal de cards com pôster, rolável por setas ou toque. */
export default function PosterCarousel({ items, label }: Props) {
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
          <Box as="li" key={item.key} flexShrink={0} w={{ base: "130px", md: "160px" }} scrollSnapAlign="start">
            <Box
              as="button"
              type="button"
              onClick={item.onClick}
              w="100%"
              textAlign="left"
              borderRadius="lg"
              transition="transform 0.2s"
              _hover={{ transform: "translateY(-4px)" }}
              _focusVisible={{ outline: "2px solid", outlineColor: "red.400", outlineOffset: "2px" }}
            >
              <AspectRatio ratio={2 / 3} mb={2}>
                <Image
                  src={item.imageUrl}
                  alt=""
                  objectFit="cover"
                  borderRadius="lg"
                  boxShadow="md"
                  loading="lazy"
                />
              </AspectRatio>
              <Text fontWeight="semibold" fontSize="sm" noOfLines={2}>
                {item.title}
              </Text>
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
