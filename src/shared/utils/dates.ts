
export function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString('de-DE');
}
