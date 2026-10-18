import { describe, it, expect } from 'vitest';
import { parseSearchType } from '../searchType';

describe('parseSearchType', () => {
  it('aceita os tipos válidos', () => {
    expect(parseSearchType('movie')).toBe('movie');
    expect(parseSearchType('tv')).toBe('tv');
    expect(parseSearchType('person')).toBe('person');
  });

  it('usa movie para valores ausentes ou inválidos', () => {
    expect(parseSearchType(null)).toBe('movie');
    expect(parseSearchType(undefined)).toBe('movie');
    expect(parseSearchType('xyz')).toBe('movie');
  });
});
