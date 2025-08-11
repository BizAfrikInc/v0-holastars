import type { SocialMediaConnection } from "@/lib/db/schema/social-media-connections"
import type { FeedbackPost } from "../posting-service"

export class FacebookService {
  private readonly baseUrl = "https://graph.facebook.com/v18.0"

  async postReview(connection: SocialMediaConnection, feedbackData: FeedbackPost): Promise<any> {
    try {
      // Facebook Graph API call to post on business page
      const response = await fetch(`${this.baseUrl}/${connection.platformAccountId}/feed`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: this.formatFacebookPost(feedbackData),
          access_token: connection.accessToken,
        }),
      })

      if (!response.ok) {
        throw new Error(`Facebook API error: ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error("Error posting to Facebook:", error)
      throw error
    }
  }

  private formatFacebookPost(feedbackData: FeedbackPost): string {
    const stars = "⭐".repeat(feedbackData.rating)
    return `🎉 Amazing ${feedbackData.rating}-star review from ${feedbackData.customerName}! ${stars}\n\n"${feedbackData.comment}"\n\nThank you for choosing ${feedbackData.businessName}! We're thrilled to have served you. 💙\n\n#CustomerReview #HappyCustomers #${feedbackData.businessName.replace(/\s+/g, "")}`
  }

  async refreshToken(connection: SocialMediaConnection): Promise<string> {
    // Facebook long-lived tokens don't need frequent refresh
    // But you can extend them if needed
    const response = await fetch(
      `${this.baseUrl}/oauth/access_token?grant_type=fb_exchange_token&client_id=${process.env.FACEBOOK_APP_ID}&client_secret=${process.env.FACEBOOK_APP_SECRET}&fb_exchange_token=${connection.accessToken}`,
    )

    const data = await response.json()
    return data.access_token
  }
}
