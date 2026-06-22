export function toSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export function parsePrice(text: string): number {
  return parseFloat(text.replace(/[^0-9.]/g, ''));
}
