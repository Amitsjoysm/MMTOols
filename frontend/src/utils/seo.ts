/**
 * SEO Analysis and Optimization Utilities
 * Provides keyword analysis, readability scores, and SEO recommendations
 */

import { toString } from 'mdast-util-to-string';

export interface KeywordAnalysis {
  keyword: string;
  count: number;
  density: number;
  prominence: number;
}

export interface SEOScore {
  overall: number;
  title: { score: number; feedback: string };
  description: { score: number; feedback: string };
  content: { score: number; feedback: string };
  keywords: { score: number; feedback: string };
  readability: { score: number; feedback: string };
}

export interface ReadabilityMetrics {
  score: number;
  grade: string;
  avgWordsPerSentence: number;
  avgSyllablesPerWord: number;
  totalWords: number;
  totalSentences: number;
}

/**
 * Calculate keyword density in text
 */
export function calculateKeywordDensity(
  text: string,
  keyword: string
): KeywordAnalysis {
  const normalizedText = text.toLowerCase();
  const normalizedKeyword = keyword.toLowerCase();
  const words = normalizedText.split(/\s+/).filter(w => w.length > 0);
  const totalWords = words.length;

  // Count exact matches
  const regex = new RegExp(`\\b${normalizedKeyword}\\b`, 'gi');
  const matches = normalizedText.match(regex);
  const count = matches ? matches.length : 0;

  // Calculate density (percentage)
  const density = totalWords > 0 ? (count / totalWords) * 100 : 0;

  // Calculate prominence (appears in first 100 words?)
  const first100Words = words.slice(0, 100).join(' ');
  const prominence = first100Words.includes(normalizedKeyword) ? 1 : 0;

  return {
    keyword,
    count,
    density: parseFloat(density.toFixed(2)),
    prominence,
  };
}

/**
 * Extract all keywords from text with their frequencies
 */
export function extractKeywords(
  text: string,
  minLength: number = 4,
  maxResults: number = 20
): KeywordAnalysis[] {
  const normalizedText = text.toLowerCase();
  const words = normalizedText
    .split(/\s+/)
    .filter(w => w.length >= minLength && !/^\d+$/.test(w));

  // Common stop words to filter out
  const stopWords = new Set([
    'the', 'and', 'for', 'are', 'but', 'not', 'you', 'all', 'can', 'her',
    'was', 'one', 'our', 'out', 'day', 'get', 'has', 'him', 'his', 'how',
    'man', 'new', 'now', 'old', 'see', 'two', 'way', 'who', 'boy', 'did',
    'its', 'let', 'put', 'say', 'she', 'too', 'use', 'this', 'that', 'with',
    'have', 'from', 'they', 'will', 'what', 'your', 'about', 'would', 'there',
    'their', 'which', 'when', 'where', 'these', 'those', 'could', 'should',
  ]);

  const wordFreq = new Map<string, number>();
  words.forEach(word => {
    if (!stopWords.has(word)) {
      wordFreq.set(word, (wordFreq.get(word) || 0) + 1);
    }
  });

  const totalWords = words.length;
  const keywords: KeywordAnalysis[] = [];

  wordFreq.forEach((count, word) => {
    keywords.push({
      keyword: word,
      count,
      density: parseFloat(((count / totalWords) * 100).toFixed(2)),
      prominence: 0,
    });
  });

  return keywords
    .sort((a, b) => b.count - a.count)
    .slice(0, maxResults);
}

/**
 * Calculate Flesch Reading Ease Score
 */
export function calculateReadability(text: string): ReadabilityMetrics {
  // Remove markdown syntax and HTML tags
  const cleanText = text
    .replace(/#{1,6}\s/g, '') // Remove markdown headers
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Remove markdown links
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/[*_`~]/g, ''); // Remove markdown formatting

  // Count sentences
  const sentences = cleanText
    .split(/[.!?]+/)
    .filter(s => s.trim().length > 0);
  const totalSentences = sentences.length || 1;

  // Count words
  const words = cleanText.split(/\s+/).filter(w => w.length > 0);
  const totalWords = words.length || 1;

  // Count syllables (approximate)
  const totalSyllables = words.reduce((count, word) => {
    return count + countSyllables(word);
  }, 0);

  const avgWordsPerSentence = totalWords / totalSentences;
  const avgSyllablesPerWord = totalSyllables / totalWords;

  // Flesch Reading Ease Score
  // Score = 206.835 - 1.015 * (total words / total sentences) - 84.6 * (total syllables / total words)
  let score = 206.835 - 1.015 * avgWordsPerSentence - 84.6 * avgSyllablesPerWord;
  score = Math.max(0, Math.min(100, score)); // Clamp between 0-100

  let grade = '';
  if (score >= 90) grade = 'Very Easy (5th grade)';
  else if (score >= 80) grade = 'Easy (6th grade)';
  else if (score >= 70) grade = 'Fairly Easy (7th grade)';
  else if (score >= 60) grade = 'Standard (8-9th grade)';
  else if (score >= 50) grade = 'Fairly Difficult (10-12th grade)';
  else if (score >= 30) grade = 'Difficult (College)';
  else grade = 'Very Difficult (College graduate)';

  return {
    score: parseFloat(score.toFixed(1)),
    grade,
    avgWordsPerSentence: parseFloat(avgWordsPerSentence.toFixed(1)),
    avgSyllablesPerWord: parseFloat(avgSyllablesPerWord.toFixed(2)),
    totalWords,
    totalSentences,
  };
}

/**
 * Count syllables in a word (approximate)
 */
function countSyllables(word: string): number {
  word = word.toLowerCase();
  if (word.length <= 3) return 1;

  // Remove non-alphabetic characters
  word = word.replace(/[^a-z]/g, '');

  // Count vowel groups
  const vowels = word.match(/[aeiouy]+/g);
  let count = vowels ? vowels.length : 0;

  // Adjust for silent 'e' at the end
  if (word.endsWith('e')) count--;

  // Ensure at least 1 syllable
  return Math.max(1, count);
}

/**
 * Calculate comprehensive SEO score for a blog post
 */
export function calculateSEOScore(
  title: string,
  description: string,
  content: string,
  focusKeyword?: string
): SEOScore {
  const scores: SEOScore = {
    overall: 0,
    title: { score: 0, feedback: '' },
    description: { score: 0, feedback: '' },
    content: { score: 0, feedback: '' },
    keywords: { score: 0, feedback: '' },
    readability: { score: 0, feedback: '' },
  };

  // Title Score (max 20 points)
  let titleScore = 0;
  if (title.length >= 30 && title.length <= 60) {
    titleScore = 20;
    scores.title.feedback = 'Title length is optimal (30-60 characters)';
  } else if (title.length < 30) {
    titleScore = 10;
    scores.title.feedback = `Title is too short (${title.length} chars). Aim for 30-60 characters.`;
  } else {
    titleScore = 15;
    scores.title.feedback = `Title is too long (${title.length} chars). Aim for 30-60 characters.`;
  }

  if (focusKeyword && title.toLowerCase().includes(focusKeyword.toLowerCase())) {
    titleScore = Math.min(20, titleScore + 5);
    scores.title.feedback += ' Focus keyword found in title! ✓';
  }
  scores.title.score = titleScore;

  // Description Score (max 20 points)
  let descScore = 0;
  if (description && description.length >= 120 && description.length <= 160) {
    descScore = 20;
    scores.description.feedback = 'Meta description length is optimal (120-160 characters)';
  } else if (!description) {
    descScore = 0;
    scores.description.feedback = 'No meta description provided';
  } else if (description.length < 120) {
    descScore = 10;
    scores.description.feedback = `Description is too short (${description.length} chars). Aim for 120-160.`;
  } else {
    descScore = 15;
    scores.description.feedback = `Description is too long (${description.length} chars). Aim for 120-160.`;
  }

  if (focusKeyword && description && description.toLowerCase().includes(focusKeyword.toLowerCase())) {
    descScore = Math.min(20, descScore + 5);
    scores.description.feedback += ' Focus keyword found! ✓';
  }
  scores.description.score = descScore;

  // Content Score (max 25 points)
  const wordCount = content.split(/\s+/).length;
  let contentScore = 0;

  if (wordCount >= 300) {
    contentScore = 25;
    scores.content.feedback = `Good content length (${wordCount} words)`;
  } else if (wordCount >= 200) {
    contentScore = 15;
    scores.content.feedback = `Content is short (${wordCount} words). Aim for 300+ words.`;
  } else {
    contentScore = 5;
    scores.content.feedback = `Content is too short (${wordCount} words). Aim for 300+ words.`;
  }
  scores.content.score = contentScore;

  // Keyword Score (max 20 points)
  let keywordScore = 0;
  if (focusKeyword) {
    const analysis = calculateKeywordDensity(content, focusKeyword);

    if (analysis.density >= 0.5 && analysis.density <= 2.5) {
      keywordScore = 15;
      scores.keywords.feedback = `Keyword density is good (${analysis.density}%)`;
    } else if (analysis.density < 0.5) {
      keywordScore = 5;
      scores.keywords.feedback = `Keyword density is low (${analysis.density}%). Aim for 0.5-2.5%.`;
    } else {
      keywordScore = 10;
      scores.keywords.feedback = `Keyword density is high (${analysis.density}%). Aim for 0.5-2.5%.`;
    }

    if (analysis.prominence === 1) {
      keywordScore += 5;
      scores.keywords.feedback += ' Found in first 100 words! ✓';
    } else {
      scores.keywords.feedback += ' Not found in first 100 words.';
    }
  } else {
    scores.keywords.feedback = 'No focus keyword set';
  }
  scores.keywords.score = keywordScore;

  // Readability Score (max 15 points)
  const readability = calculateReadability(content);
  let readScore = 0;

  if (readability.score >= 60 && readability.score <= 80) {
    readScore = 15;
    scores.readability.feedback = `Readability is good (${readability.score}/100 - ${readability.grade})`;
  } else if (readability.score >= 50) {
    readScore = 10;
    scores.readability.feedback = `Readability is acceptable (${readability.score}/100 - ${readability.grade})`;
  } else {
    readScore = 5;
    scores.readability.feedback = `Content may be difficult to read (${readability.score}/100 - ${readability.grade})`;
  }
  scores.readability.score = readScore;

  // Calculate overall score
  scores.overall = titleScore + descScore + contentScore + keywordScore + readScore;

  return scores;
}

/**
 * Generate SEO-friendly slug from text
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .substring(0, 60); // Limit length
}

/**
 * Optimize meta description from content
 */
export function generateMetaDescription(
  content: string,
  maxLength: number = 155
): string {
  // Remove markdown and get first paragraph
  const cleanText = content
    .replace(/#{1,6}\s/g, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/<[^>]*>/g, '')
    .replace(/[*_`~]/g, '')
    .trim();

  const sentences = cleanText.split(/[.!?]+/).filter(s => s.trim().length > 0);

  if (sentences.length === 0) return '';

  let description = sentences[0].trim();

  // Add more sentences if under max length
  for (let i = 1; i < sentences.length && description.length < maxLength; i++) {
    const nextSentence = sentences[i].trim();
    if (description.length + nextSentence.length + 2 <= maxLength) {
      description += '. ' + nextSentence;
    } else {
      break;
    }
  }

  // Truncate if too long
  if (description.length > maxLength) {
    description = description.substring(0, maxLength - 3) + '...';
  } else if (!description.endsWith('.')) {
    description += '.';
  }

  return description;
}
