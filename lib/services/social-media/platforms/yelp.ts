import type { SocialMediaConnection } from "@/lib/db/schema/social-media-connections"
import type { FeedbackPost } from "../posting-service"

export class YelpService {
  private readonly baseUrl = "https://api.yelp.com/v3"

  async postReview(connection: SocialMediaConnection, feedbackData: FeedbackPost): Promise<any> {
    try {
      // Note: Yelp doesn't allow direct review posting via API
      // This would typically be used for responding to existing reviews
      // or posting business updates

      const response = await fetch(`${this.baseUrl}/businesses/${connection.platformAccountId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${connection.accessToken}`,
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error(`Yelp API error: ${response.statusText}`)
      }

      // For now, we'll log the positive feedback
      // In a real implementation, you might use this to update business info
      // or respond to existing reviews
      console.log(`Positive feedback received for Yelp business: ${this.formatYelpResponse(feedbackData)}`)

      return { success: true, message: "Feedback logged for Yelp integration" }
    } catch (error) {
      console.error("Error with Yelp integration:", error)
      throw error
    }
  }

  private formatYelpResponse(feedbackData: FeedbackPost): string {
    return `${feedbackData.rating}-star feedback from ${feedbackData.customerName}: "${feedbackData.comment}"`
  }

  async refreshToken(connection: SocialMediaConnection): Promise<string> {
    // Yelp uses API keys, not OAuth tokens that expire
    return connection.accessToken
  }
}
