import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import NotFoundPage from '../NotFoundPage';

describe('NotFoundPage', () => {
  it('exibe a mensagem de página não encontrada', () => {
    render(
      <MemoryRouter>
        <ChakraProvider>
          <NotFoundPage />
        </ChakraProvider>
      </MemoryRouter>,
    );

    expect(screen.getByText('404')).toBeInTheDocument();
    expect(screen.getByText('Página não encontrada')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Voltar para a página inicial' })).toBeInTheDocument();
  });
});
