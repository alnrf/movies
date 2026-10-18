import type { SearchType } from "../types/SearchType";

const RECENT_ITEMS_KEY = "recent_items";
const MAX_RECENT_ITEMS = 10;

/** Item aberto a partir de uma busca, exibido em "Buscas recentes". */
export interface RecentItem {
  id: number;
  type: SearchType;
  name: string;
  imagePath: string | null;
  date: string;
}

export function getRecentItems(): RecentItem[] {
  try {
    const raw = localStorage.getItem(RECENT_ITEMS_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function addRecentItem(item: Omit<RecentItem, "date">) {
  const updated: RecentItem[] = [
    { ...item, date: new Date().toISOString() },
    ...getRecentItems().filter((i) => i.id !== item.id || i.type !== item.type),
  ].slice(0, MAX_RECENT_ITEMS);

  try {
    localStorage.setItem(RECENT_ITEMS_KEY, JSON.stringify(updated));
  } catch {
    // Armazenamento indisponível (modo privado, cota cheia): ignora.
  }
}
