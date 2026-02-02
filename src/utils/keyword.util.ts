export const parseKeywords = (raw: string): string[] => {
  return raw
    .split("\n")
    .map(k => k.trim())
    .filter(Boolean);
};
