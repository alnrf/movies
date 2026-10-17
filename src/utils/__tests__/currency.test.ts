import { describe, it, expect } from 'vitest';
import { formatMoney } from '../currency';

describe('formatMoney', () => {
  it('formata em dólar com o código da moeda', () => {
    expect(formatMoney(1000).replace(/\s/g, ' ')).toBe('US$ 1.000,00 (USD)');
  });

  it('formata zero', () => {
    expect(formatMoney(0).replace(/\s/g, ' ')).toBe('US$ 0,00 (USD)');
  });
});
