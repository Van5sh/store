"use server"

import { cookies } from "next/headers"
import { AxiosError } from "axios"
import { apiHandler } from "@/app/utils/ApiHandler"

type GetUsersParams = {
  page?: number
  limit?: number
}

type ApiErrorResponse = {
  message?: string
  error?: string
}

export async function getUsers(params: GetUsersParams = {}) {
  const token = (await cookies()).get("access_token")?.value

  try {
    const res = await apiHandler.get("/users", {
      params: {
        page: params.page ?? 1,
        limit: params.limit ?? 10,
      },
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    })
    return res.data
  } catch (error) {
    const err = error as AxiosError<ApiErrorResponse>
    const status = err.response?.status ?? 500
    const data = err.response?.data
    const message =
      data?.message ??
      data?.error ??
      (status === 401 ? "Unauthorized" : "Error fetching users")

    throw new Error(message)
  }
}
