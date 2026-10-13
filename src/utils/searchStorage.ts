import type { SearchType } from "../types/SearchType";

const LAST_SEARCH_KEY = "last_search";
const SEARCH_HISTORY_KEY = "search_history";

export interface SearchHistoryItem {
  query: string;
  type: SearchType;
  date: string;
}

export function saveLastSearch(query: string, type: SearchType) {
  const data: SearchHistoryItem = {
    query,
    type,
    date: new Date().toISOString(),
  };

  localStorage.setItem(LAST_SEARCH_KEY, JSON.stringify(data));
}

export function getLastSearch(): SearchHistoryItem | null {
  const raw = localStorage.getItem(LAST_SEARCH_KEY);
  return raw ? JSON.parse(raw) : null;
}

export function addToSearchHistory(query: string, type: SearchType) {
  const raw = localStorage.getItem(SEARCH_HISTORY_KEY);
  const history: SearchHistoryItem[] = raw ? JSON.parse(raw) : [];

  const newItem: SearchHistoryItem = {
    query,
    type,
    date: new Date().toISOString(),
  };

  const updated = [
    newItem,
    ...history.filter(
      (item) => item.query !== query || item.type !== type
    ),
  ].slice(0, 5); // limite de 5

  localStorage.setItem(
    SEARCH_HISTORY_KEY,
    JSON.stringify(updated)
  );
}

export function getSearchHistory(): SearchHistoryItem[] {
  const raw = localStorage.getItem(SEARCH_HISTORY_KEY);
  return raw ? JSON.parse(raw) : [];
}
