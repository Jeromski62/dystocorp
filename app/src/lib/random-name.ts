export function randomCharacterName(firstNames: string[], lastNames: string[]): string {
  if (firstNames.length === 0 || lastNames.length === 0) return "";
  const first = firstNames[Math.floor(Math.random() * firstNames.length)];
  const last = lastNames[Math.floor(Math.random() * lastNames.length)];
  return `${first} ${last}`;
}
