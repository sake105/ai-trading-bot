
export function formatCurrency(value: number, currency = 'EUR') {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency,
  }).format(value);
}

export function formatPercent(value: number) {
  return `${(value * 100).toFixed(2)} %`;
}
