import { describe, it, expect } from 'vitest';
import { getYearFromDate, formatDate, calculateAgeDetailed } from '../date';

describe('getYearFromDate', () => {
  it('extrai o ano de uma data ISO válida', () => {
    expect(getYearFromDate('2000-06-15T12:00:00')).toBe(2000);
  });

  it('retorna null para null', () => {
    expect(getYearFromDate(null)).toBeNull();
  });

  it('retorna null para undefined', () => {
    expect(getYearFromDate(undefined)).toBeNull();
  });

  it('retorna null para string inválida', () => {
    expect(getYearFromDate('nao-e-data')).toBeNull();
  });

  it('retorna null para string vazia', () => {
    expect(getYearFromDate('')).toBeNull();
  });
});

describe('formatDate', () => {
  it('formata data ISO para DD/MM/YYYY', () => {
    // Usa horário meio-dia para evitar problema de timezone
    expect(formatDate('2000-06-15T12:00:00')).toBe('15/06/2000');
  });

  it('retorna null para null', () => {
    expect(formatDate(null)).toBeNull();
  });

  it('retorna null para undefined', () => {
    expect(formatDate(undefined)).toBeNull();
  });

  it('retorna null para string inválida', () => {
    expect(formatDate('nao-e-data')).toBeNull();
  });

  it('preenche dia e mês com zero à esquerda', () => {
    expect(formatDate('1990-01-05T12:00:00')).toBe('05/01/1990');
  });
});

describe('calculateAgeDetailed', () => {
  it('calcula idade corretamente com data de fim explícita', () => {
    expect(calculateAgeDetailed('1980-01-01', '2025-01-01')).toBe('45 a, 0 m, 0 d');
  });

  it('considera meses e dias incompletos', () => {
    expect(calculateAgeDetailed('1980-06-15', '2025-06-10')).toBe('44 a, 11 m, 26 d');
  });

  it('retorna "—" para data de nascimento inválida', () => {
    expect(calculateAgeDetailed('nao-e-data')).toBe('—');
  });

  it('retorna "—" para data de fim inválida', () => {
    expect(calculateAgeDetailed('1980-01-01', 'invalida')).toBe('—');
  });

  it('calcula corretamente quando aniversário é no mesmo mês', () => {
    expect(calculateAgeDetailed('1990-03-20', '2020-03-20')).toBe('30 a, 0 m, 0 d');
  });
});
