import { describe, it, expect, vi } from 'vitest';
import { useState } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import ImageLightbox from '../ImageLightbox';

const IMAGES = ['/a.jpg', '/b.jpg', '/c.jpg'];

function Harness({ start = 0, onClose = vi.fn() }: { start?: number | null; onClose?: () => void }) {
  const [index, setIndex] = useState<number | null>(start);
  return (
    <ImageLightbox
      images={IMAGES}
      index={index}
      onIndexChange={setIndex}
      onClose={() => {
        onClose();
        setIndex(null);
      }}
      title="Breaking Bad"
    />
  );
}

function renderLightbox(props: Parameters<typeof Harness>[0] = {}) {
  render(
    <ChakraProvider>
      <Harness {...props} />
    </ChakraProvider>,
  );
}

const shownImage = () => screen.getByRole('img').getAttribute('src');

describe('ImageLightbox', () => {
  it('não renderiza nada sem imagem selecionada', () => {
    renderLightbox({ start: null });
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });

  it('mostra a imagem selecionada e o contador', () => {
    renderLightbox({ start: 1 });
    expect(shownImage()).toBe('/b.jpg');
    expect(screen.getByText('2 / 3')).toBeInTheDocument();
  });

  it('navega pelas setas, voltando ao início depois da última', () => {
    renderLightbox({ start: 2 });
    fireEvent.click(screen.getByRole('button', { name: 'Próxima imagem' }));
    expect(shownImage()).toBe('/a.jpg');
    fireEvent.click(screen.getByRole('button', { name: 'Imagem anterior' }));
    expect(shownImage()).toBe('/c.jpg');
  });

  it('navega pelas setas do teclado', () => {
    renderLightbox({ start: 0 });
    fireEvent.keyDown(screen.getByRole('dialog'), { key: 'ArrowRight' });
    expect(shownImage()).toBe('/b.jpg');
    fireEvent.keyDown(screen.getByRole('dialog'), { key: 'ArrowLeft' });
    expect(shownImage()).toBe('/a.jpg');
  });

  it('chama onClose ao fechar', () => {
    const onClose = vi.fn();
    renderLightbox({ start: 0, onClose });
    fireEvent.click(screen.getByRole('button', { name: 'Close' }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  describe("deslize no celular/tablet", () => {
    const swipeArea = () => screen.getByRole("img").parentElement!.parentElement!;
    function swipe(from: [number, number], to: [number, number]) {
      fireEvent.touchStart(swipeArea(), { touches: [{ clientX: from[0], clientY: from[1] }] });
      fireEvent.touchEnd(swipeArea(), { changedTouches: [{ clientX: to[0], clientY: to[1] }] });
    }

    it("deslizar para a esquerda avança", () => {
      renderLightbox({ start: 0 });
      swipe([300, 200], [150, 210]);
      expect(shownImage()).toBe("/b.jpg");
    });

    it("deslizar para a direita volta, passando para a última", () => {
      renderLightbox({ start: 0 });
      swipe([100, 200], [260, 190]);
      expect(shownImage()).toBe("/c.jpg");
    });

    it("ignora toques curtos e gestos verticais", () => {
      renderLightbox({ start: 0 });
      swipe([200, 200], [180, 200]);
      swipe([200, 100], [140, 400]);
      expect(shownImage()).toBe("/a.jpg");
    });
  });
});
