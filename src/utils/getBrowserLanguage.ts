export function getBrowserLanguage(): string {
  if (typeof navigator === "undefined") {
    return "pt-BR";
  }

  const language =
    navigator.languages?.[0] || navigator.language || "pt-BR";
  const [lang, region] = language.split("-");

  if (region) {
    return `${lang.toLowerCase()}-${region.toUpperCase()}`;
  }

  // fallback se vier só "en"
  return `${lang.toLowerCase()}-${lang.toUpperCase()}`;
}
