import { describe, it, expect, beforeEach } from 'vitest';
import { getSidebarCollapsed, saveSidebarCollapsed } from '../preferences';

beforeEach(() => {
  localStorage.clear();
});

describe('preferência da sidebar', () => {
  it('começa expandida quando não há nada salvo', () => {
    expect(getSidebarCollapsed()).toBe(false);
  });

  it('salva e recupera o estado recolhido', () => {
    saveSidebarCollapsed(true);
    expect(getSidebarCollapsed()).toBe(true);
    saveSidebarCollapsed(false);
    expect(getSidebarCollapsed()).toBe(false);
  });
});
