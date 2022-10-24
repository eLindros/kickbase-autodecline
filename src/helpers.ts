export const timestamp = (): void => {
  const now = new Date();
  console.log(`${now.toLocaleDateString()} | ${now.toLocaleTimeString()}`);
};
