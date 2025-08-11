import { AxiosResponse } from "axios"
import apiClient from "@/lib/api/index"
import {
  CreateCustomerRequest,
  JsonResponse, UpdateCustomerRequest,
} from "@/lib/helpers/validation-types"



export const CustomersApi = {
  singleCreate: (data: CreateCustomerRequest,  signal?: AbortSignal): Promise<AxiosResponse<JsonResponse>> =>
    apiClient.post('/api/customers', data, { signal }),
  batchCreate: (data: CreateCustomerRequest[],  signal?: AbortSignal): Promise<AxiosResponse<JsonResponse>> =>
    apiClient.post('/api/customers/bulk', data, { signal }),
  update: (data: UpdateCustomerRequest, id: string, signal?: AbortSignal): Promise<AxiosResponse<JsonResponse>> =>
    apiClient.patch(`/api/customers/${id}`, data, { signal }),
  delete: (id: string, signal?: AbortSignal): Promise<AxiosResponse<JsonResponse>> =>
  apiClient.delete(`/api/customers/${id}`, { signal }),
  fetchAll:  ()=>apiClient.get('/api/customers'),
  fetchById:  async (id:string , signal ?: AbortSignal) => await apiClient.get(`/api/customers/${id}`, { signal }),
}