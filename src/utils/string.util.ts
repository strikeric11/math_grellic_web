export function capitalize(text: string) {
  return `${text.charAt(0).toUpperCase()}${text.slice(1)}`;
}

export function generateOrdinalSuffix(value: number) {
  const i = value % 10;
  const j = value % 100;

  if (i == 1 && j != 11) {
    return value + 'st';
  }
  if (i == 2 && j != 12) {
    return value + 'nd';
  }
  if (i == 3 && j != 13) {
    return value + 'rd';
  }
  return value + 'th';
}

export const alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');
