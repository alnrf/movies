import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Route, Routes, useParams } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ChakraProvider } from '@chakra-ui/react';
import SimilarTitles from '../SimilarTitles';
import { getSimilar } from '../../api/tmdbService';

vi.mock('../../api/tmdbService', () => ({ getSimilar: vi.fn() }));

const mockedGetSimilar = vi.mocked(getSimilar);

function respond(results: unknown[]) {
  mockedGetSimilar.mockResolvedValue({ data: { results } } as never);
}

function DetailStub() {
  const { id } = useParams();
  return <p>detalhe {id}</p>;
}

function renderSimilar(mediaType: 'movie' | 'tv') {
  render(
    <ChakraProvider>
      <QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}>
        <MemoryRouter initialEntries={['/']}>
          <Routes>
            <Route path="/" element={<SimilarTitles mediaType={mediaType} id={1} title="Origem" />} />
            <Route path="/movie/:id" element={<DetailStub />} />
            <Route path="/tv/:id" element={<DetailStub />} />
          </Routes>
        </MemoryRouter>
      </QueryClientProvider>
    </ChakraProvider>,
  );
}

beforeEach(() => {
  mockedGetSimilar.mockReset();
  window.scrollTo = vi.fn();
});

describe('SimilarTitles', () => {
  it('mostra título e título original dos filmes e leva ao detalhe', async () => {
    respond([{ id: 451048, title: 'Jungle Cruise', original_title: 'Jungle Cruise (orig)', poster_path: '/a.jpg' }]);
    renderSimilar('movie');

    expect(await screen.findByText('Jungle Cruise')).toBeInTheDocument();
    expect(screen.getByText('Jungle Cruise (orig)')).toBeInTheDocument();
    expect(mockedGetSimilar).toHaveBeenCalledWith('movie', 1);

    fireEvent.click(screen.getByText('Jungle Cruise'));
    expect(await screen.findByText('detalhe 451048')).toBeInTheDocument();
    expect(window.scrollTo).toHaveBeenCalled();
  });

  it('usa name e original_name para séries e leva ao detalhe da série', async () => {
    respond([{ id: 1399, name: 'A Guerra dos Tronos', original_name: 'Game of Thrones', poster_path: null }]);
    renderSimilar('tv');

    fireEvent.click(await screen.findByText('A Guerra dos Tronos'));
    expect(screen.getByText('detalhe 1399')).toBeInTheDocument();
  });

  it('avisa quando não há semelhantes', async () => {
    respond([]);
    renderSimilar('movie');
    expect(await screen.findByText('Nenhum título semelhante encontrado.')).toBeInTheDocument();
  });

  it('avisa quando a busca falha', async () => {
    mockedGetSimilar.mockRejectedValue(new Error('falhou'));
    renderSimilar('movie');
    expect(
      await screen.findByText('Não foi possível carregar os títulos semelhantes.'),
    ).toBeInTheDocument();
  });
});
