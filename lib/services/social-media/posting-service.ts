import type { SocialMediaConnection } from "@/lib/db/schema/social-media-connections"
import { FacebookService } from "./platforms/facebook"
import { GoogleBusinessService } from "./platforms/google-business"
import { YelpService } from "./platforms/yelp"

export interface FeedbackPost {
  customerName: string
  rating: number
  comment: string
  businessName: string
  responseDate: Date
}

export class SocialMediaPostingService {
  private googleBusinessService: GoogleBusinessService
  private facebookService: FacebookService
  private yelpService: YelpService

  constructor() {
    this.googleBusinessService = new GoogleBusinessService()
    this.facebookService = new FacebookService()
    this.yelpService = new YelpService()
  }

  async postToAllPlatforms(
    connections: SocialMediaConnection[],
    feedbackData: FeedbackPost,
  ): Promise<{ success: boolean; results: any[] }> {
    const results = []

    for (const connection of connections) {
      try {
        // Check if rating meets minimum threshold
        const minRating = Number.parseInt(connection.minRatingThreshold || "4")
        if (feedbackData.rating < minRating) {
          continue
        }

        let result
        switch (connection.platform) {
          case "google_business":
            result = await this.googleBusinessService.postReview(connection, feedbackData)
            break
          case "facebook":
            result = await this.facebookService.postReview(connection, feedbackData)
            break
          case "yelp":
            result = await this.yelpService.postReview(connection, feedbackData)
            break
          default:
            continue
        }

        results.push({
          platform: connection.platform,
          success: true,
          data: result,
        })
      } catch (error) {
        results.push({
          platform: connection.platform,
          success: false,
          error: error instanceof Error ? error.message : "Unknown error",
        })
      }
    }

    return {
      success: results.some((r) => r.success),
      results,
    }
  }
}

export const socialMediaPostingService = new SocialMediaPostingService()
