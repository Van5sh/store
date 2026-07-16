"use server"

import { cookies } from "next/headers"
import { AxiosError } from "axios"
import { apiHandler } from "@/app/utils/ApiHandler"

type ApiErrorResponse = {
  message?: string
  error?: string
}

type ProductTypeInput = {
  type?: string
  category?: string
}

export async function getProductType(
  payload: ProductTypeInput
) {
  const typeParam = payload.type ?? payload.category
  const type = typeParam?.trim().toLowerCase() ?? ""

  if (!type) {
    throw new Error("Missing required query param: type or category")
  }

  const token = (await cookies()).get("access_token")?.value

  try {
    const res = await apiHandler.get(
      `/products/type/${encodeURIComponent(type)}`,
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
      (status === 401 ? "Unauthorized" : "Failed to fetch products")

    throw new Error(message)
  }
}
