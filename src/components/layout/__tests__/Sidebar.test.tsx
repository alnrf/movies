import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import Sidebar from '../Sidebar';

function renderAt(path: string) {
  render(
    <ChakraProvider>
      <MemoryRouter initialEntries={[path]}>
        <Sidebar />
      </MemoryRouter>
    </ChakraProvider>,
  );
}

function activeItem() {
  return screen
    .getAllByRole('link')
    .find((link) => link.getAttribute('aria-current') === 'page')
    ?.textContent;
}

describe('Sidebar', () => {
  it('exibe o título e os itens do menu', () => {
    renderAt('/');
    expect(screen.getByText('Movie Search')).toBeInTheDocument();
    for (const label of ['Home', 'Filmes', 'Séries', 'Atores']) {
      expect(screen.getByRole('link', { name: label })).toBeInTheDocument();
    }
  });

  it('marca Home como ativo na página inicial', () => {
    renderAt('/');
    expect(activeItem()).toBe('Home');
  });

  it('marca o tipo da busca como ativo', () => {
    renderAt('/search?type=tv&query=lost');
    expect(activeItem()).toBe('Séries');
  });

  it('marca Filmes como ativo no detalhe de um filme', () => {
    renderAt('/movie/10');
    expect(activeItem()).toBe('Filmes');
  });

  it('aponta os itens para a busca do tipo correspondente', () => {
    renderAt('/');
    expect(screen.getByRole('link', { name: 'Atores' })).toHaveAttribute(
      'href',
      '/search?type=person',
    );
  });
});
