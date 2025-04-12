import { ISong } from '@songModule';

export const normalizeGenre = (genre: ISong['genre']): string[] => {
  return genre.flatMap((g) => {
    try {
      const parsed = JSON.parse(g);
      return Array.isArray(parsed) ? parsed : [parsed];
    } catch {
      return [g]; // Leave as-is if not JSON string
    }
  });
};
