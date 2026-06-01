import { describe, it, expect, beforeEach } from 'vitest';
import {
  saveLastSearch,
  getLastSearch,
  addToSearchHistory,
  getSearchHistory,
} from '../searchStorage';

beforeEach(() => {
  localStorage.clear();
});

describe('saveLastSearch / getLastSearch', () => {
  it('salva e recupera a última busca', () => {
    saveLastSearch('Batman', 'movie');
    const result = getLastSearch();
    expect(result).not.toBeNull();
    expect(result.query).toBe('Batman');
    expect(result.type).toBe('movie');
  });

  it('sobrescreve a busca anterior', () => {
    saveLastSearch('Batman', 'movie');
    saveLastSearch('Breaking Bad', 'tv');
    const result = getLastSearch();
    expect(result.query).toBe('Breaking Bad');
    expect(result.type).toBe('tv');
  });

  it('retorna null quando não há busca salva', () => {
    expect(getLastSearch()).toBeNull();
  });

  it('persiste a data junto com a busca', () => {
    saveLastSearch('Batman', 'movie');
    const result = getLastSearch();
    expect(result.date).toBeDefined();
    expect(new Date(result.date).toString()).not.toBe('Invalid Date');
  });
});

describe('addToSearchHistory / getSearchHistory', () => {
  it('adiciona item ao histórico', () => {
    addToSearchHistory('Batman', 'movie');
    const history = getSearchHistory();
    expect(history).toHaveLength(1);
    expect(history[0].query).toBe('Batman');
  });

  it('insere mais recente no início', () => {
    addToSearchHistory('Batman', 'movie');
    addToSearchHistory('Superman', 'movie');
    const history = getSearchHistory();
    expect(history[0].query).toBe('Superman');
    expect(history[1].query).toBe('Batman');
  });

  it('não duplica a mesma query+type', () => {
    addToSearchHistory('Batman', 'movie');
    addToSearchHistory('Batman', 'movie');
    expect(getSearchHistory()).toHaveLength(1);
  });

  it('permite mesma query com tipo diferente', () => {
    addToSearchHistory('Batman', 'movie');
    addToSearchHistory('Batman', 'tv');
    expect(getSearchHistory()).toHaveLength(2);
  });

  it('limita o histórico a 5 itens', () => {
    for (let i = 1; i <= 6; i++) {
      addToSearchHistory(`Busca ${i}`, 'movie');
    }
    expect(getSearchHistory()).toHaveLength(5);
  });

  it('retorna array vazio quando não há histórico', () => {
    expect(getSearchHistory()).toEqual([]);
  });
});
