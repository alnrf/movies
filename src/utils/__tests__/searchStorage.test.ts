import { describe, it, expect, beforeEach } from 'vitest';
import { addRecentItem, getRecentItems } from '../searchStorage';

beforeEach(() => {
  localStorage.clear();
});

const batman = { id: 1, type: 'movie' as const, name: 'Batman', imagePath: '/b.jpg' };

describe('addRecentItem / getRecentItems', () => {
  it('adiciona item com data', () => {
    addRecentItem(batman);
    const items = getRecentItems();
    expect(items).toHaveLength(1);
    expect(items[0]).toMatchObject(batman);
    expect(new Date(items[0].date).toString()).not.toBe('Invalid Date');
  });

  it('insere o mais recente no início', () => {
    addRecentItem(batman);
    addRecentItem({ ...batman, id: 2, name: 'Superman' });
    const items = getRecentItems();
    expect(items[0].name).toBe('Superman');
    expect(items[1].name).toBe('Batman');
  });

  it('não duplica o mesmo id+tipo e move para o topo', () => {
    addRecentItem(batman);
    addRecentItem({ ...batman, id: 2, name: 'Superman' });
    addRecentItem(batman);
    const items = getRecentItems();
    expect(items).toHaveLength(2);
    expect(items[0].name).toBe('Batman');
  });

  it('permite mesmo id com tipo diferente', () => {
    addRecentItem(batman);
    addRecentItem({ ...batman, type: 'tv' });
    expect(getRecentItems()).toHaveLength(2);
  });

  it('limita a 10 itens', () => {
    for (let i = 1; i <= 12; i++) addRecentItem({ ...batman, id: i });
    expect(getRecentItems()).toHaveLength(10);
  });

  it('retorna array vazio sem dados ou com JSON inválido', () => {
    expect(getRecentItems()).toEqual([]);
    localStorage.setItem('recent_items', '{quebrado');
    expect(getRecentItems()).toEqual([]);
  });
});
