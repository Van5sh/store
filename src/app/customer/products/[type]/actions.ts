"use server"

import { cookies } from "next/headers"
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
