import { AVERAGE_NUMBER_OF_WORDS_IN_MINUTE } from '../../asset/constants';

const _countWordsInString = (str: string) => str.trim().split(/\s+/).length;

export const _calculateReadingTimePerMinute = (content: string) => {
  const words = _countWordsInString(content);

  return Math.round(words / AVERAGE_NUMBER_OF_WORDS_IN_MINUTE);
};
