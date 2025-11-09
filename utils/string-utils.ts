export const escapeRegExp = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
export const normalizeString = (s: string) => s.replace(/\s+/g, ' ').trim();

export const dollarsToCents = (s: string) => Math.round(Number(s.replace(/[^0-9.]/g, '')) * 100);