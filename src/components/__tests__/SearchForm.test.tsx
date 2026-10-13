import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import SearchForm from '../SearchForm';

function renderForm(overrides: Partial<Parameters<typeof SearchForm>[0]> = {}) {
  const props = {
    query: '',
    type: 'movie' as const,
    onQueryChange: vi.fn(),
    onTypeChange: vi.fn(),
    onSearch: vi.fn(),
    ...overrides,
  };

  render(
    <ChakraProvider>
      <SearchForm {...props} />
    </ChakraProvider>,
  );

  return props;
}

describe('SearchForm', () => {
  it('renderiza o input e os três tipos de busca', () => {
    renderForm();
    expect(screen.getByPlaceholderText('Pesquisar...')).toBeInTheDocument();
    expect(screen.getByLabelText('Filmes')).toBeInTheDocument();
    expect(screen.getByLabelText('Seriados')).toBeInTheDocument();
    expect(screen.getByLabelText('Atores')).toBeInTheDocument();
  });

  it('chama onQueryChange ao digitar', () => {
    const props = renderForm();
    fireEvent.change(screen.getByPlaceholderText('Pesquisar...'), {
      target: { value: 'Batman' },
    });
    expect(props.onQueryChange).toHaveBeenCalledWith('Batman');
  });

  it('chama onSearch ao submeter o formulário', () => {
    const props = renderForm({ query: 'Batman' });
    fireEvent.click(screen.getByRole('button', { name: 'Buscar' }));
    expect(props.onSearch).toHaveBeenCalledTimes(1);
  });

  it('exibe botão de limpar apenas quando há texto', () => {
    renderForm({ query: '' });
    expect(screen.queryByLabelText('Limpar busca')).not.toBeInTheDocument();
  });

  it('chama onQueryChange com string vazia ao limpar', () => {
    const props = renderForm({ query: 'Batman' });
    fireEvent.click(screen.getByLabelText('Limpar busca'));
    expect(props.onQueryChange).toHaveBeenCalledWith('');
  });
});
