import type { SearchType } from "../types/SearchType";

const LAST_SEARCH_KEY = "last_search";
const SEARCH_HISTORY_KEY = "search_history";

export function saveLastSearch(query: string, type: SearchType) {
  const data = {
    query,
    type,
    date: new Date().toISOString(),
  };

  localStorage.setItem(LAST_SEARCH_KEY, JSON.stringify(data));
}

export function getLastSearch() {
  const raw = localStorage.getItem(LAST_SEARCH_KEY);
  return raw ? JSON.parse(raw) : null;
}

export function addToSearchHistory(query: string, type: SearchType) {
  const raw = localStorage.getItem(SEARCH_HISTORY_KEY);
  const history = raw ? JSON.parse(raw) : [];

  const newItem = {
    query,
    type,
    date: new Date().toISOString(),
  };

  const updated = [
    newItem,
    ...history.filter(
      (item: any) => item.query !== query || item.type !== type
    ),
  ].slice(0, 5); // limite de 5

  localStorage.setItem(
    SEARCH_HISTORY_KEY,
    JSON.stringify(updated)
  );
}

export function getSearchHistory() {
  const raw = localStorage.getItem(SEARCH_HISTORY_KEY);
  return raw ? JSON.parse(raw) : [];
}
