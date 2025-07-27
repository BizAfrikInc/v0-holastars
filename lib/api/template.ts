import { AxiosResponse } from "axios"
import apiClient from "@/lib/api/index"

import {
  CreateTemplateWithQuestionsDTO,
  JsonResponse,
  UpdateFeedbackTemplateRequest,
} from "@/lib/helpers/validation-types"

export const FeedbackTemplatesApi = {
  create: (data: CreateTemplateWithQuestionsDTO,  signal?: AbortSignal): Promise<AxiosResponse<JsonResponse>> =>
    apiClient.post('/api/feedback-templates', data, { signal }),
  update: (data: UpdateFeedbackTemplateRequest, id: string, signal?: AbortSignal): Promise<AxiosResponse<JsonResponse>> =>
    apiClient.patch(`/api/feedback-templates/${id}`, data, { signal }),
  delete: (id: string, signal?: AbortSignal): Promise<AxiosResponse<JsonResponse>> =>
    apiClient.delete(`/api/feedback-templates/${id}`, { signal }),
  fetchAll:  ()=>apiClient.get('/api/feedback-templates'),
  fetchById:  async (id:string , signal ?: AbortSignal) => await apiClient.get(`/api/feedback-templates/${id}`, { signal }),
}