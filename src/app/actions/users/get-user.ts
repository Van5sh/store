"use server"

import { cookies } from "next/headers"
import { AxiosError } from "axios"
import { apiHandler } from "@/app/utils/ApiHandler"

export async function getUser(id: string) {
  const normalizedId = id?.trim()
  if (!normalizedId) {
    throw new Error("User ID is required")
  }

  const token = (await cookies()).get("access_token")?.value

  try {
    const res = await apiHandler.get(`/users/${normalizedId}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    })
    return res.data
  } catch (error) {
    const err = error as AxiosError<any>
    const status = err.response?.status ?? 500
    const data = err.response?.data
    const message =
      data?.message ??
      data?.error ??
      (status === 401 ? "Unauthorized" : "Error fetching user")

    throw new Error(message)
  }
}
