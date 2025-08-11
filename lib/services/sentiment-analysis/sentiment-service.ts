import type { NewSentimentAnalysis } from "@/lib/db/schema/sentiment-analysis"
import { sentimentAnalysisRepository } from "@/lib/db/repositories/sentiment-analysis-repository"

export interface SentimentResult {
  sentiment: "positive" | "negative" | "neutral"
  confidence: number
  keywords: string[]
  summary: string
}

export class SentimentAnalysisService {
  async analyzeSentiment(text: string): Promise<SentimentResult> {
    // For now, implementing a simple rule-based approach
    // In production, you would integrate with OpenAI, Google Cloud Natural Language, or similar
    const positiveWords = [
      "good",
      "great",
      "excellent",
      "amazing",
      "wonderful",
      "fantastic",
      "love",
      "perfect",
      "satisfied",
      "happy",
    ]
    const negativeWords = [
      "bad",
      "terrible",
      "awful",
      "horrible",
      "hate",
      "disappointed",
      "unsatisfied",
      "poor",
      "worst",
      "angry",
    ]

    const lowerText = text.toLowerCase()
    const words = lowerText.split(/\s+/)

    let positiveCount = 0
    let negativeCount = 0
    const foundKeywords: string[] = []

    words.forEach((word) => {
      if (positiveWords.includes(word)) {
        positiveCount++
        foundKeywords.push(word)
      } else if (negativeWords.includes(word)) {
        negativeCount++
        foundKeywords.push(word)
      }
    })

    let sentiment: "positive" | "negative" | "neutral"
    let confidence: number

    if (positiveCount > negativeCount) {
      sentiment = "positive"
      confidence = Math.min(0.9, 0.5 + (positiveCount - negativeCount) * 0.1)
    } else if (negativeCount > positiveCount) {
      sentiment = "negative"
      confidence = Math.min(0.9, 0.5 + (negativeCount - positiveCount) * 0.1)
    } else {
      sentiment = "neutral"
      confidence = 0.5
    }

    return {
      sentiment,
      confidence,
      keywords: foundKeywords,
      summary: `Analyzed text shows ${sentiment} sentiment with ${Math.round(confidence * 100)}% confidence`,
    }
  }

  async processAndStoreSentiment(questionAnswerId: string, text: string): Promise<void> {
    try {
      const result = await this.analyzeSentiment(text)

      const sentimentData: NewSentimentAnalysis = {
        questionAnswerId,
        sentiment: result.sentiment,
        confidence: result.confidence,
        keywords: result.keywords,
        summary: result.summary,
      }

      await sentimentAnalysisRepository.create(sentimentData)
    } catch (error) {
      console.error("Error processing sentiment analysis:", error)
      // Don't throw - sentiment analysis failure shouldn't break the main flow
    }
  }
}

export const sentimentAnalysisService = new SentimentAnalysisService()
