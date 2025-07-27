import { AxiosResponse } from "axios"
import apiClient from "@/lib/api/index"
import {
  CreateDepartmentRequest,
  JsonResponse, UpdateDepartmentRequest,
} from "@/lib/helpers/validation-types"

export const DepartmentsApi = {
  create: (data: CreateDepartmentRequest,  signal?: AbortSignal): Promise<AxiosResponse<JsonResponse>> =>
    apiClient.post('/api/departments', data, { signal }),
  update: (data: UpdateDepartmentRequest, id: string, signal?: AbortSignal): Promise<AxiosResponse<JsonResponse>> =>
    apiClient.patch(`/api/departments/${id}`, data, { signal }),
  delete: (id: string, signal?: AbortSignal): Promise<AxiosResponse<JsonResponse>> =>
    apiClient.delete(`/api/departments/${id}`, { signal }),
  fetchAll:  (): Promise<AxiosResponse<JsonResponse>> =>apiClient.get('/api/departments'),
  fetchById:  async (id:string , signal ?: AbortSignal): Promise<AxiosResponse<JsonResponse>> => await apiClient.get(`/api/departments/${id}`, { signal }),
}