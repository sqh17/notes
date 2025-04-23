// 缓存字符分词结果，避免重复计算
const tokenizeCache = new Map<string, string[]>()

// 缓存词频结果，避免重复统计
const termFreqCache = new Map<string, Record<string, number>>()

/**
 * 对文本进行字符级分词（去除空格、小写化），带缓存
 * @param text 原始文本
 * @returns 字符数组
 */
function tokenizeByChar(text: string): string[] {
  if (tokenizeCache.has(text)) return tokenizeCache.get(text)!
  const tokens = text.toLowerCase().replace(/\s+/g, '').split('')
  tokenizeCache.set(text, tokens)
  return tokens
}

/**
 * 根据字符数组计算每个字符出现的频率，带缓存
 * @param tokens 字符数组
 * @returns 词频映射对象
 */
function termFrequency(tokens: string[]): Record<string, number> {
  const key = tokens.join('')
  if (termFreqCache.has(key)) return termFreqCache.get(key)!
  const freq: Record<string, number> = {}
  for (const token of tokens) {
    freq[token] = (freq[token] || 0) + 1
  }
  termFreqCache.set(key, freq)
  return freq
}

/**
 * 计算两个文本的余弦相似度（范围：0-1）
 * @param text1 文本1
 * @param text2 文本2
 * @returns 相似度（0 表示完全不同，1 表示完全相同）
 */
export function cosineSimilarity(text1: string, text2: string): number {
  const tokens1 = tokenizeByChar(text1)
  const tokens2 = tokenizeByChar(text2)

  const freq1 = termFrequency(tokens1)
  const freq2 = termFrequency(tokens2)

  // 合并所有出现过的字符，作为向量维度
  const allTokens = new Set([...Object.keys(freq1), ...Object.keys(freq2)])

  const vec1: number[] = []
  const vec2: number[] = []

  // 构造两个词频向量
  allTokens.forEach((token) => {
    vec1.push(freq1[token] || 0)
    vec2.push(freq2[token] || 0)
  })

  // 计算点积
  const dotProduct = vec1.reduce((sum, val, i) => sum + val * vec2[i], 0)

  // 计算两个向量的模长（magnitude）
  const magnitude1 = Math.sqrt(vec1.reduce((sum, val) => sum + val * val, 0))
  const magnitude2 = Math.sqrt(vec2.reduce((sum, val) => sum + val * val, 0))

  // 若有一个向量长度为0，则相似度为0
  if (magnitude1 === 0 || magnitude2 === 0) return 0

  // 返回余弦相似度
  return dotProduct / (magnitude1 * magnitude2)
}

/**
 * 返回两个文本的重复率（百分比形式）
 * @param text1 文本1
 * @param text2 文本2
 * @returns 相似度百分比（0~100）
 */
export function cosSameWords(text1: string, text2: string): number {
  const similarity = cosineSimilarity(text1, text2)
  return Math.round(similarity * 100)
}


// 例子
// import {cosSameWords} from './cosSameWords'
// const text1 = 'Hello World'
// const text2 = 'Hello there'
// const similarity = cosSameWords(text1, text2)
// console.log(`相似度: ${similarity}%`) // 输出相似度百分比