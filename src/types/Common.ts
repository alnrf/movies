export interface Genre {
  id: number;
  name: string;
}

/** Imagem de /movie/{id}/images ou /tv/{id}/images. */
export interface MediaImage {
  file_path: string;
  width: number;
  height: number;
  aspect_ratio: number;
}

export interface MediaImagesResponse {
  id: number;
  backdrops: MediaImage[];
}
