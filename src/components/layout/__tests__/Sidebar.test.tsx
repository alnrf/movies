import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import Sidebar from '../Sidebar';
import { theme } from '../../../theme';

beforeEach(() => {
  localStorage.clear();
});

function renderAt(path: string, props: Parameters<typeof Sidebar>[0] = {}) {
  render(
    <ChakraProvider theme={theme}>
      <MemoryRouter initialEntries={[path]}>
        <Sidebar {...props} />
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
  it('exibe o logo, o texto Menu e os itens do menu', () => {
    renderAt('/');
    expect(screen.getByAltText('Movie & TV Search')).toBeInTheDocument();
    expect(screen.getByText('Menu')).toBeInTheDocument();
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

  it('recolhida, oculta o texto Menu e mantém os itens acessíveis', () => {
    renderAt('/', { collapsed: true, onToggleCollapse: vi.fn() });
    expect(screen.queryByText('Menu')).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Filmes' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Expandir menu' })).toBeInTheDocument();
  });

  it('chama onToggleCollapse ao clicar em recolher', () => {
    const onToggle = vi.fn();
    renderAt('/', { onToggleCollapse: onToggle });
    fireEvent.click(screen.getByRole('button', { name: 'Recolher menu' }));
    expect(onToggle).toHaveBeenCalledTimes(1);
  });

  it('não mostra o botão de recolher sem onToggleCollapse', () => {
    renderAt('/');
    expect(screen.queryByRole('button', { name: 'Recolher menu' })).not.toBeInTheDocument();
  });

  it('alterna o tema e salva a escolha', () => {
    renderAt('/');
    fireEvent.click(screen.getByRole('button', { name: 'Tema escuro' }));
    expect(screen.getByRole('button', { name: 'Tema claro' })).toBeInTheDocument();
    expect(localStorage.getItem('chakra-ui-color-mode')).toBe('dark');
  });
});
