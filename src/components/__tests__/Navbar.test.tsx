import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Navbar from '../Navbar';

describe('Navbar', () => {
  it('não exibe o botão de voltar na home', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <Navbar />
      </MemoryRouter>,
    );
    expect(screen.queryByRole('button', { name: 'Voltar' })).not.toBeInTheDocument();
  });

  it('exibe o botão de voltar fora da home', () => {
    render(
      <MemoryRouter initialEntries={['/movie/1']}>
        <Navbar />
      </MemoryRouter>,
    );
    expect(screen.getByRole('button', { name: 'Voltar' })).toBeInTheDocument();
  });

  it('exibe o título MovieSearch', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <Navbar />
      </MemoryRouter>,
    );
    expect(screen.getByText('MovieSearch')).toBeInTheDocument();
  });
});
