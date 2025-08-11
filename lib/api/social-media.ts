import type { AxiosResponse } from "axios"
import apiClient from "@/lib/api/index"
import type { JsonResponse } from "@/lib/helpers/validation-types"

export interface SocialMediaConnectionData {
  platform: "google_business" | "facebook" | "yelp"
  platformAccountId: string
  platformAccountName: string
  accessToken: string
  refreshToken?: string
  tokenExpiresAt?: Date
  autoPostEnabled?: boolean
  minRatingThreshold?: string
}

export interface UpdateSocialMediaConnectionData {
  platformAccountName?: string
  autoPostEnabled?: boolean
  minRatingThreshold?: string
  isActive?: boolean
}

export const SocialMediaApi = {
  connect: (
    data: SocialMediaConnectionData,
    businessId: string,
    signal?: AbortSignal,
  ): Promise<AxiosResponse<JsonResponse>> =>
    apiClient.post(`/api/social-media-connections`, { ...data, businessId }, { signal }),

  getConnections: (businessId: string, signal?: AbortSignal): Promise<AxiosResponse<JsonResponse>> =>
    apiClient.get(`/api/social-media-connections?businessId=${businessId}`, { signal }),

  updateConnection: (
    connectionId: string,
    data: UpdateSocialMediaConnectionData,
    signal?: AbortSignal,
  ): Promise<AxiosResponse<JsonResponse>> =>
    apiClient.patch(`/api/social-media-connections/${connectionId}`, data, { signal }),

  disconnectAccount: (connectionId: string, signal?: AbortSignal): Promise<AxiosResponse<JsonResponse>> =>
    apiClient.delete(`/api/social-media-connections/${connectionId}`, { signal }),
}
