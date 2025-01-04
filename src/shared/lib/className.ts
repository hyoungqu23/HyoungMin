type TClassNameValue = string | boolean | null | undefined;
type TClassNameObject = Record<string, boolean>;

export const cls = (...classNames: Array<TClassNameValue | TClassNameObject>) => {
  return classNames
    .map((className) => {
      if (typeof className === 'string') {
        return className;
      }

      if (typeof className === 'object') {
        return Object.entries(className as TClassNameObject)
          .filter(([_, value]) => value)
          .map(([key, _]) => key)
          .join(' ');
      }

      return '';
    })
    .filter(Boolean)
    .join(' ');
};
