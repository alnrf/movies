import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Skeleton, Stack, Text } from "@chakra-ui/react";
import { getMediaImages } from "../api/tmdbService";
import { getBackdropUrl } from "../utils/tmdbImage";
import PosterCarousel from "./PosterCarousel";
import ImageLightbox from "./ImageLightbox";
import type { MediaImagesResponse } from "../types/Common";

interface Props {
  mediaType: "movie" | "tv";
  id: number;
  /** Nome do filme ou série, usado nos textos alternativos. */
  title: string;
}

const THUMB_WIDTH = { base: "220px", md: "280px" };

/** Faixa com as imagens do filme/série; ao clicar, abre a imagem ampliada. */
export default function MediaGallery({ mediaType, id, title }: Props) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["images", mediaType, id],
    queryFn: async () =>
      ((await getMediaImages(mediaType, id)).data as MediaImagesResponse).backdrops ?? [],
  });

  if (isLoading) {
    return (
      <Stack direction="row" spacing={4} overflow="hidden">
        {Array.from({ length: 4 }, (_, i) => (
          <Skeleton key={i} w={THUMB_WIDTH} h={{ base: "124px", md: "158px" }} borderRadius="lg" flexShrink={0} />
        ))}
      </Stack>
    );
  }

  if (isError) {
    return <Text color="red.500">Não foi possível carregar as imagens.</Text>;
  }

  const images = data ?? [];
  if (images.length === 0) {
    return <Text color="text.muted">Nenhuma imagem disponível.</Text>;
  }

  return (
    <>
      <PosterCarousel
        label={`Imagens de ${title}`}
        ratio={16 / 9}
        itemWidth={THUMB_WIDTH}
        items={images.map((image, i) => ({
          key: image.file_path,
          ariaLabel: `Ampliar imagem ${i + 1} de ${images.length}`,
          imageUrl: getBackdropUrl(image.file_path, "SMALL"),
          onClick: () => setOpenIndex(i),
        }))}
      />

      <ImageLightbox
        images={images.map((image) => getBackdropUrl(image.file_path, "LARGE"))}
        index={openIndex}
        onIndexChange={setOpenIndex}
        onClose={() => setOpenIndex(null)}
        title={title}
      />
    </>
  );
}
