export const timestamp = (locale: string, timeZone: string): void => {
  const now = new Date();
  console.log(`${now.toLocaleString(locale, { timeZone })}`);
};
