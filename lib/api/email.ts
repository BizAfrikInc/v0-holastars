import { AxiosResponse } from "axios"
import apiClient from "@/lib/api/index"
import {
  JsonResponse,
} from "@/lib/helpers/validation-types"
import { EmailRequest } from "@/lib/services/emails/zeptomail/types"

export const mailingApi = {
  send: (data: EmailRequest, signal?: AbortSignal): Promise<AxiosResponse<JsonResponse>> =>
    apiClient.post("/api/send_emails", data, { signal })
}