export const cls = (
  ...classNames: Array<string | boolean | null | undefined>
): string => {
  return classNames
    .filter((className) => className && typeof className === 'string')
    .join(' ');
};

export const getRandomColor = () => {
  const letters = '0123456789ABCDEF';

  let color = '#';

  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }

  return color;
};
