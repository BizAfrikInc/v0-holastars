import { AxiosResponse } from "axios"
import apiClient from "@/lib/api/index"
import {
  CreateBusinessRequest,
  JsonResponse, UpdateBusinessRequest,
} from "@/lib/helpers/validation-types"

export const BusinessApi = {
  create: (data: CreateBusinessRequest, signal?: AbortSignal): Promise<AxiosResponse<JsonResponse>> =>
    apiClient.post("/api/business", data, { signal }),
  update: (data: UpdateBusinessRequest, id: string, signal?: AbortSignal): Promise<AxiosResponse<JsonResponse>> =>
    apiClient.patch(`/api/business/${id}`, data, { signal })
}