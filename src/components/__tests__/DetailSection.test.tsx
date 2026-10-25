import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import DetailSection from '../DetailSection';

function renderSection() {
  render(
    <ChakraProvider>
      <DetailSection title="Elenco do Filme">
        <p>conteúdo</p>
      </DetailSection>
    </ChakraProvider>,
  );
  return screen.getByRole('button', { name: 'Elenco do Filme' });
}

describe('DetailSection', () => {
  it('mantém o título como cabeçalho e começa aberta', () => {
    const button = renderSection();
    expect(screen.getByRole('heading', { name: 'Elenco do Filme' })).toBeInTheDocument();
    expect(button).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByText('conteúdo')).toBeInTheDocument();
  });

  it('recolhe ao clicar no título', () => {
    const button = renderSection();
    fireEvent.click(button);
    expect(button).toHaveAttribute('aria-expanded', 'false');
  });
});
