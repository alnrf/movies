import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import ErrorBoundary from '../ErrorBoundary';

function Bomb(): never {
  throw new Error('Falha proposital');
}

describe('ErrorBoundary', () => {
  it('renderiza os filhos normalmente quando não há erro', () => {
    render(
      <ChakraProvider>
        <ErrorBoundary>
          <div>conteúdo normal</div>
        </ErrorBoundary>
      </ChakraProvider>,
    );
    expect(screen.getByText('conteúdo normal')).toBeInTheDocument();
  });

  it('exibe a UI de fallback quando um filho lança um erro', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <ChakraProvider>
        <ErrorBoundary>
          <Bomb />
        </ErrorBoundary>
      </ChakraProvider>,
    );

    expect(screen.getByText('Algo deu errado')).toBeInTheDocument();
    expect(screen.getByText('Falha proposital')).toBeInTheDocument();

    vi.restoreAllMocks();
  });
});
