const SIDEBAR_COLLAPSED_KEY = "sidebar_collapsed";

export function getSidebarCollapsed(): boolean {
  try {
    return localStorage.getItem(SIDEBAR_COLLAPSED_KEY) === "true";
  } catch {
    return false;
  }
}

export function saveSidebarCollapsed(collapsed: boolean) {
  try {
    localStorage.setItem(SIDEBAR_COLLAPSED_KEY, String(collapsed));
  } catch {
    // Armazenamento indisponível (modo privado, cota cheia): ignora.
  }
}
