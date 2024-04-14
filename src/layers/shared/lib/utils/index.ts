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

export const capitalizeFirstLetter = (str: string) =>
  str.charAt(0).toUpperCase() + str.slice(1);

export const getRootDirectoryPath = () => process.cwd();

export const format = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}년 ${month}월 ${day}일`;
};
