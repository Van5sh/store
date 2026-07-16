"use server"

import { cookies } from "next/headers"
import { AxiosError } from "axios"
import { apiHandler } from "@/app/utils/ApiHandler"

type ApiErrorResponse = {
  message?: string
  error?: string
}

export async function getRecentOrders() {
  const token = (await cookies()).get("access_token")?.value

  try {
    const res = await apiHandler.get("/order/latest", {
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
      (status === 401 ? "Unauthorized" : "Failed to fetch orders")

    throw new Error(message)
  }
}
