/** Formata o valor em dólar, ex.: "US$ 1.000,00 (USD)". Os valores do TMDB são em USD. */
export function formatMoney(value: number): string {
  const formatted = value.toLocaleString("pt-BR", { style: "currency", currency: "USD" });
  return `${formatted} (USD)`;
}
