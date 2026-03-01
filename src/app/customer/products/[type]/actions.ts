"use server"

import { cookies, headers } from "next/headers"
import { apiHandler } from "@/app/utils/ApiHandler"

export async function getProductsByType(type: string) {
  const normalized = type?.trim()
  if (!normalized) {
    throw new Error("Missing product type")
  }

  const token = (await cookies()).get("access_token")?.value
  try {
    const res = await apiHandler.get(
      `/products/type/${encodeURIComponent(normalized)}`,
      {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      }
    )
    return res.data
  } catch (error: any) {
    const data = error?.response?.data
    const message =
      data?.message ??
      data?.error ??
      error?.message ??
      "Failed to fetch products"
    throw new Error(message)
  }
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
  } catch (error: any) {
    const data = error?.response?.data
    const message =
      data?.message ??
      data?.error ??
      error?.message ??
      "Failed to create order"
    throw new Error(message)
  }
}