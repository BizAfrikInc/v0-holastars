import { AxiosResponse } from "axios"
import apiClient from "@/lib/api/index"
import {
  JsonResponse, ResetPasswordRequest, UpdateUserRequest,
} from "@/lib/helpers/validation-types"

export const UsersApi = {
  update: (data: UpdateUserRequest, id: string, signal?: AbortSignal): Promise<AxiosResponse<JsonResponse>> =>
    apiClient.patch(`/api/users/${id}`, data, { signal }),
    resetPassword: (data: ResetPasswordRequest, id: string , signal?: AbortSignal) =>
    apiClient.post( `/api/auth/reset-password/${id}`, data, { signal }),
}