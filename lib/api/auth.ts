import { AxiosResponse } from "axios"
import apiClient from "@/lib/api/index"
import {
  AuthResponse,
  ForgotPasswordRequest, JsonResponse,
  LoginRequest,
  RegisterRequest,
  ResetPasswordRequest,
  UserRolesPermissionRequest,
  VerifyEmailRequest,
} from "@/lib/helpers/validation-types"

export const authApi = {
  login: (data: LoginRequest, signal?: AbortSignal): Promise<AxiosResponse<AuthResponse>> =>
    apiClient.post("/api/auth/login", data, { signal }),
  signup: (data: RegisterRequest, signal?: AbortSignal): Promise<AxiosResponse<JsonResponse>> =>
    apiClient.post("/api/auth/register", data, { signal }),
  forgotPassword: (data: ForgotPasswordRequest, signal?: AbortSignal) =>
    apiClient.post("/api/auth/forgot-password", data, { signal }),
  resetPassword: (data: ResetPasswordRequest, signal?: AbortSignal) =>
    apiClient.post("/api/auth/reset-password", data, { signal }),
  logout: (signal?: AbortSignal) => apiClient.post("/api/auth/logout", {}, {signal}),
  getUserRolesPermissions: (data: UserRolesPermissionRequest,signal?: AbortSignal) => apiClient.post("/api/auth/user-roles-and-permissions", data, {signal}),
  emailVerification: (token: VerifyEmailRequest, signal?: AbortSignal) =>
    apiClient.get(`/api/auth/email-verification?token=${token}`, {signal}),
};


