import { useRef, type KeyboardEvent, type TouchEvent } from "react";
import {
  Flex,
  IconButton,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";

interface Props {
  images: string[];
  /** Posição da imagem aberta; null fecha o modal. */
  index: number | null;
  onIndexChange: (index: number) => void;
  onClose: () => void;
  /** Usado no texto alternativo, ex.: "Breaking Bad". */
  title: string;
}

/** Distância mínima do dedo, em pixels, para contar como deslize. */
const SWIPE_MIN_PX = 50;

/** Modal com a imagem ampliada; navega por setas, teclado ou deslize no celular/tablet. */
export default function ImageLightbox({ images, index, onIndexChange, onClose, title }: Props) {
  const count = images.length;
  const isOpen = index !== null && count > 0;
  const current = index ?? 0;

  // Passa da última para a primeira e vice-versa.
  const go = (step: 1 | -1) => onIndexChange((current + step + count) % count);

  function handleKeyDown(e: KeyboardEvent) {
    if (e.key === "ArrowRight") go(1);
    if (e.key === "ArrowLeft") go(-1);
  }

  // Deslizar o dedo para a esquerda avança; para a direita, volta.
  const touchStart = useRef<{ x: number; y: number } | null>(null);

  function handleTouchStart(e: TouchEvent) {
    const touch = e.touches[0];
    touchStart.current = { x: touch.clientX, y: touch.clientY };
  }

  function handleTouchEnd(e: TouchEvent) {
    const start = touchStart.current;
    touchStart.current = null;
    if (!start || count < 2) return;
    const touch = e.changedTouches[0];
    const dx = touch.clientX - start.x;
    const dy = touch.clientY - start.y;
    // Ignora toques curtos e gestos mais verticais que horizontais.
    if (Math.abs(dx) < SWIPE_MIN_PX || Math.abs(dx) < Math.abs(dy)) return;
    go(dx < 0 ? 1 : -1);
  }

  const arrowProps = {
    isRound: true,
    size: "lg",
    bg: "whiteAlpha.200",
    color: "white",
    _hover: { bg: "whiteAlpha.400" },
    flexShrink: 0,
    isDisabled: count < 2,
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="full" isCentered>
      <ModalOverlay bg="blackAlpha.900" />
      <ModalContent bg="transparent" boxShadow="none" onKeyDown={handleKeyDown}>
        <ModalCloseButton color="white" size="lg" top={4} right={4} zIndex={1} />
        <ModalBody display="flex" flexDirection="column" justifyContent="center" p={{ base: 2, md: 6 }}>
          <Flex
            align="center"
            gap={{ base: 1, md: 4 }}
            flex="1"
            minH={0}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            sx={{ touchAction: "pan-y" }}
          >
            <IconButton
              {...arrowProps}
              aria-label="Imagem anterior"
              icon={<ChevronLeftIcon boxSize={8} />}
              onClick={() => go(-1)}
            />
            <Flex flex="1" minW={0} h="100%" align="center" justify="center">
              {isOpen && (
                <Image
                  key={images[current]}
                  src={images[current]}
                  alt={`${title}: imagem ${current + 1} de ${count}`}
                  maxW="100%"
                  maxH="80vh"
                  objectFit="contain"
                  borderRadius="md"
                  draggable={false}
                  userSelect="none"
                />
              )}
            </Flex>
            <IconButton
              {...arrowProps}
              aria-label="Próxima imagem"
              icon={<ChevronRightIcon boxSize={8} />}
              onClick={() => go(1)}
            />
          </Flex>
          <Text textAlign="center" color="whiteAlpha.800" fontSize="sm" mt={3}>
            {current + 1} / {count}
          </Text>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
