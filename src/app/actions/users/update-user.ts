"use server"

import { cookies } from "next/headers"
import { AxiosError } from "axios"
import { apiHandler } from "@/app/utils/ApiHandler"

type ApiErrorResponse = {
  message?: string
  error?: string
}

type UpdateUserInput = {
  id: string
  name?: string
  email?: string
}

export async function updateUser(payload: UpdateUserInput) {
  const userId = payload.id?.trim()
  if (!userId) {
    throw new Error("User ID is required")
  }

  const token = (await cookies()).get("access_token")?.value

  try {
    const res = await apiHandler.patch(
      `/users/${userId}`,
      {
        name: payload.name?.trim() || undefined,
        email: payload.email?.trim() || undefined,
      },
      {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      }
    )

    return res.data
  } catch (error) {
    const err = error as AxiosError<ApiErrorResponse>
    const status = err.response?.status ?? 500
    const data = err.response?.data
    const message =
      data?.message ??
      data?.error ??
      (status === 401 ? "Unauthorized" : "Failed to update user")

    throw new Error(message)
  }
}
