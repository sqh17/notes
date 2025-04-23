// 词频映射类型：key 是字符，value 是出现次数
type FrequencyMap = Record<string, number>

/**
 * 用于计算两个文本之间的余弦相似度，并支持缓存优化的服务类
 */
class CosineSimilarityService {
  // 分词缓存：避免对相同文本重复分词
  private tokenizeCache = new Map<string, string[]>()

  // 词频缓存：避免对相同分词结果重复计算词频
  private termFreqCache = new Map<string, FrequencyMap>()

  // 缓存最大条数限制，超过则自动淘汰最早插入的数据（模拟 LRU 策略）
  private maxCacheSize: number

  constructor(maxCacheSize = 500) {
    this.maxCacheSize = maxCacheSize
  }

  /**
   * 保证缓存不超过最大限制，超出时删除最早插入的记录（Map天然有插入顺序）
   * @param cache 需要限制大小的缓存 Map
   */
  private enforceCacheLimit(cache: Map<any, any>) {
    while (cache.size > this.maxCacheSize) {
      const oldestKey = cache.keys().next().value
      cache.delete(oldestKey)
    }
  }

  /**
   * 将文本进行字符级分词（小写化 + 去空格），并缓存结果
   * @param text 文本字符串
   * @returns 分词后的字符数组
   */
  private tokenizeByChar(text: string): string[] {
    if (this.tokenizeCache.has(text)) {
      return this.tokenizeCache.get(text)!
    }
    const tokens = text.toLowerCase().replace(/\s+/g, '').split('')
    this.tokenizeCache.set(text, tokens)
    this.enforceCacheLimit(this.tokenizeCache)
    return tokens
  }

  /**
   * 统计字符频率（词频），并缓存结果
   * @param tokens 分词后的字符数组
   * @returns 字符频率映射表
   */
  private termFrequency(tokens: string[]): FrequencyMap {
    const key = tokens.join('') // 作为缓存键值
    if (this.termFreqCache.has(key)) {
      return this.termFreqCache.get(key)!
    }
    const freq: FrequencyMap = {}
    for (const token of tokens) {
      freq[token] = (freq[token] || 0) + 1
    }
    this.termFreqCache.set(key, freq)
    this.enforceCacheLimit(this.termFreqCache)
    return freq
  }

  /**
   * 计算两个文本的余弦相似度（0~1）
   * @param text1 文本1
   * @param text2 文本2
   * @returns 余弦相似度，值越大表示文本越相似
   */
  public cosineSimilarity(text1: string, text2: string): number {
    const tokens1 = this.tokenizeByChar(text1)
    const tokens2 = this.tokenizeByChar(text2)

    const freq1 = this.termFrequency(tokens1)
    const freq2 = this.termFrequency(tokens2)

    // 所有可能出现的字符集合，作为向量的维度
    const allTokens = new Set([...Object.keys(freq1), ...Object.keys(freq2)])

    const vec1: number[] = []
    const vec2: number[] = []

    // 构建两个向量
    allTokens.forEach((token) => {
      vec1.push(freq1[token] || 0)
      vec2.push(freq2[token] || 0)
    })

    // 计算点积
    const dotProduct = vec1.reduce((sum, val, i) => sum + val * vec2[i], 0)

    // 计算模长
    const magnitude1 = Math.sqrt(vec1.reduce((sum, val) => sum + val * val, 0))
    const magnitude2 = Math.sqrt(vec2.reduce((sum, val) => sum + val * val, 0))

    // 避免除以 0
    if (magnitude1 === 0 || magnitude2 === 0) return 0

    // 返回余弦相似度
    return dotProduct / (magnitude1 * magnitude2)
  }

  /**
   * 计算两个文本的重复率（0~100 的整数百分比）
   * @param text1 文本1
   * @param text2 文本2
   * @returns 相似度百分比
   */
  public cosSameWords(text1: string, text2: string): number {
    return Math.round(this.cosineSimilarity(text1, text2) * 100)
  }

  /**
   * 手动清空所有缓存（token 分词 & 词频）
   */
  public clearCache() {
    this.tokenizeCache.clear()
    this.termFreqCache.clear()
  }
}


// 例子
// import {CosineSimilarityService} from './cosSameWords_class'
// const cosineService = new CosineSimilarityService(500)
// const text1 = 'hello world'
// const text2 = 'hello there'
// const similarity = cosineService.cosSameWords(text1, text2)
// console.log(`相似度: ${similarity}%`) // 输出相似度百分比 
// cosineService.clearCache() // 清空缓存
