export function parseExtraEmails(raw: string): { list: string[]; invalid: string[] } {
  const parts = raw.split(/[,;\s]+/).map((e) => e.trim()).filter(Boolean);
  const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return { list: parts.filter((e) => ok.test(e)), invalid: parts.filter((e) => !ok.test(e)) };
}
