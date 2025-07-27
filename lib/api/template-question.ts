import { AxiosResponse } from "axios"
import apiClient from "@/lib/api/index"

import { CreateFeedbackTemplateQuestionRequest, JsonResponse, UpdateTemplateQuestionRequest } from "@/lib/helpers/validation-types"

export const FeedbackTemplateQuestionsApi = {
  create: (data: CreateFeedbackTemplateQuestionRequest,  signal?: AbortSignal): Promise<AxiosResponse<JsonResponse>> =>
    apiClient.post('/api/feedback-template-questions', data, { signal }),
  update: (data: UpdateTemplateQuestionRequest, id: string, signal?: AbortSignal): Promise<AxiosResponse<JsonResponse>> =>
    apiClient.patch(`/api/feedback-template-questions/${id}`, data, { signal }),
  delete: (id: string, signal?: AbortSignal): Promise<AxiosResponse<JsonResponse>> =>
    apiClient.delete(`/api/feedback-template-questions/${id}`, { signal }),
  fetchAll:  ()=>apiClient.get('/api/feedback-template-questions'),
  fetchById:  async (id:string , signal ?: AbortSignal) => await apiClient.get(`/api/feedback-template-questions/${id}`, { signal }),
  fetchByTemplateId:  async (templateId:string , signal ?: AbortSignal) => await apiClient.get(`/api/feedback-template-questions/by-template/${templateId}`, { signal }),
}