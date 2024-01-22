export const cls = (
  ...classNames: Array<string | boolean | null | undefined>
): string => {
  return classNames
    .filter((className) => className && typeof className === 'string')
    .join(' ');
};
