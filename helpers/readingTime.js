// constants for calculating reading time of an article.
const wordsPerMinute = 230;

/**
 * input any string.
 * output 'keeps all word characters
 * returns the total number of characters'
 */

const countWords = (body) => {
  const reg = new RegExp(/(\w{1})+/, 'g');
  return (body.match(reg) || []).length;
};

const totalReadTime = (body, wordsPerMin = wordsPerMinute) => {
  const wordCount = countWords(body);
  const wordTime = wordCount / wordsPerMin;
  if (wordTime < 0.5) {
    return 'Less than a minute read ';
  }
  if (wordTime >= 0.5 && wordTime < 1.5) {
    return '1 min read';
  }
  return `${Math.round(wordTime)} min read`;
};

const nonReadTime = (time) => {
  if (time <= 0.3333) {
    return time;
  }
  return `${Math.round(time)}`;
};

export default { totalReadTime, nonReadTime };
