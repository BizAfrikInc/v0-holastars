import type { SocialMediaConnection } from "@/lib/db/schema/social-media-connections"
import type { FeedbackPost } from "../posting-service"

export class GoogleBusinessService {
  private readonly baseUrl = "https://mybusiness.googleapis.com/v4"

  async postReview(connection: SocialMediaConnection, feedbackData: FeedbackPost): Promise<any> {
    try {
      // Google My Business API call to post review response
      const response = await fetch(
        `${this.baseUrl}/accounts/${connection.platformAccountId}/locations/${connection.platformAccountId}/reviews`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${connection.accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            comment: this.formatReviewResponse(feedbackData),
            createTime: feedbackData.responseDate.toISOString(),
          }),
        },
      )

      if (!response.ok) {
        throw new Error(`Google Business API error: ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error("Error posting to Google Business:", error)
      throw error
    }
  }

  private formatReviewResponse(feedbackData: FeedbackPost): string {
    return `Thank you ${feedbackData.customerName} for your ${feedbackData.rating}-star feedback! We appreciate your review: "${feedbackData.comment}" - ${feedbackData.businessName} Team`
  }

  async refreshToken(connection: SocialMediaConnection): Promise<string> {
    // Implement Google OAuth token refresh
    const response = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        refresh_token: connection.refreshToken!,
        grant_type: "refresh_token",
      }),
    })

    const data = await response.json()
    return data.access_token
  }
}
