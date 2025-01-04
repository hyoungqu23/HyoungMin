const AVERAGE_NUMBER_OF_WORDS_IN_MINUTE = 225;

const countWordsInString = (str: string) => str.trim().split(/\s+/).length;

export const _calculateReadingTimePerMinute = (content: string) => {
  const words = countWordsInString(content);

  return Math.round(words / AVERAGE_NUMBER_OF_WORDS_IN_MINUTE);
};
