import { AxiosResponse } from "axios"
import apiClient from "@/lib/api/index"
import {
  CreateLocationRequest,
  JsonResponse, UpdateLocationRequest,
} from "@/lib/helpers/validation-types"

export const LocationsApi = {
  create: (data: CreateLocationRequest,  signal?: AbortSignal): Promise<AxiosResponse<JsonResponse>> =>
    apiClient.post('/api/locations', data, { signal }),
  update: (data: UpdateLocationRequest, id: string, signal?: AbortSignal): Promise<AxiosResponse<JsonResponse>> =>
    apiClient.patch(`/api/locations/${id}`, data, { signal }),
  delete: (id: string, signal?: AbortSignal): Promise<AxiosResponse<JsonResponse>> =>
  apiClient.delete(`/api/locations/${id}`, { signal }),
  fetchAll:  ()=>apiClient.get('/api/locations'),
  fetchById:  async (id:string , signal ?: AbortSignal) => await apiClient.get(`/api/locations/${id}`, { signal }),
  fetchAllWithDepartments: async () => await apiClient.get('/api/locations/with-departments'),
}