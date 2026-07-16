"use server"

import { cookies } from "next/headers"
import { AxiosError } from "axios"
import { apiHandler } from "@/app/utils/ApiHandler"

type ApiErrorResponse = {
  message?: string
  error?: string
}

type CreateOrderInput = {
  productId: string
  quantity: number
  userId: string
}

export async function createOrder(payload: CreateOrderInput) {
  const token = (await cookies()).get("access_token")?.value
  try {
    const res = await apiHandler.post(
      "/order",
      {
        productId: payload.productId,
        quantity: payload.quantity,
        userId: payload.userId,
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
      (status === 401 ? "Unauthorized" : "Failed to create order")
    throw new Error(message)
  }
}
