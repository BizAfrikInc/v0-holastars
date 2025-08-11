import { AxiosResponse } from "axios"
import apiClient from "@/lib/api/index"

import { CreateFeedbackRequestDTO, JsonResponse, UpdateFeedbackRequestDTO, UpdateTemplateQuestionRequest } from "@/lib/helpers/validation-types"

export const FeedbackRequestApi = {
  create: (data: CreateFeedbackRequestDTO,  signal?: AbortSignal): Promise<AxiosResponse<JsonResponse>> =>
    apiClient.post('/api/feedback-requests', data, { signal }),
  update: (data: UpdateFeedbackRequestDTO, id: string, signal?: AbortSignal): Promise<AxiosResponse<JsonResponse>> =>
    apiClient.patch(`/api/feedback-requests/${id}`, data, { signal }),
  delete: (id: string, signal?: AbortSignal): Promise<AxiosResponse<JsonResponse>> =>
    apiClient.delete(`/api/feedback-requests/${id}`, { signal }),
  fetchAll:  ()=>apiClient.get('/api/feedback-requests'),
  fetchById:  async (id:string , signal ?: AbortSignal) => await apiClient.get(`/api/feedback-requests/${id}`, { signal }),
  fetchFeedbackRequestDetails:  async (id:string , signal ?: AbortSignal) => await apiClient.get(`/api/feedback-requests/details/${id}`, { signal }),

}