"use server"

import { cookies } from "next/headers"
import { AxiosError } from "axios"
import { apiHandler } from "@/app/utils/ApiHandler"

type ApiErrorResponse = {
  message?: string
  error?: string
}

type OrderHistoryInput = {
  userId: string
  status?: string
}

export async function getOrderHistory(
  payload: OrderHistoryInput
) {
  const userId = payload.userId?.trim()
  if (!userId) {
    throw new Error("User ID is required")
  }

  const statusParam =
    payload.status ??
    "pending,processing,shipped,delivered,cancelled"

  const token = (await cookies()).get("access_token")?.value

  try {
    const response = await apiHandler.get(
      `/order/user/${userId}/history`,
      {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        params: { status: statusParam },
      }
    )

    const orders = Array.isArray(response.data?.orders)
      ? response.data.orders
      : Array.isArray(response.data)
      ? response.data
      : []

    return { orders }
  } catch (error) {
    const err = error as AxiosError<ApiErrorResponse>
    const status = err.response?.status ?? 500
    const data = err.response?.data
    const message =
      data?.message ??
      data?.error ??
      (status === 401 ? "Unauthorized" : "Failed to fetch order history")

    throw new Error(message)
  }
}
