import { apiHandler } from "@/app/utils/ApiHandler"
import type { createWarehouseType, WarehouseData } from "@/interfaces/warehouse"
import { getStoredAuthUser, getStoredToken } from "@/lib/auth-storage"

type ApiErrorResponse = {
  message?: string
  error?: string
}

function authHeaders() {
  const token = getStoredToken()
  if (!token) {
    throw new Error("Authentication token missing")
  }

  return {
    Authorization: `Bearer ${token}`,
  }
}

export async function createWarehouse(data: createWarehouseType) {
  try {
    if (!data) {
      throw new Error("Missing warehouse data")
    }

    const res = await apiHandler.post(
      "/warehouse",
      {
        userID: data.userID,
        warehouseCapacity: data.warehouseCapacity,
        warehouseName: data.warehouseName,
        cityName: data.city,
      },
      {
        headers: authHeaders(),
      }
    )

    return res.data?.data ?? res.data
  } catch (error: unknown) {
    const err = error as {
      response?: { data?: ApiErrorResponse }
      message?: string
    }
    const message =
      err.response?.data?.message ||
      err.response?.data?.error ||
      err.message ||
      "Failed to create warehouse"

    throw new Error(message)
  }
}

export async function getWarehouses(): Promise<WarehouseData[]> {
  try {
    const userId = getStoredAuthUser()?.id
    if (!userId) {
      throw new Error("User ID not found")
    }

    const res = await apiHandler.get(`/warehouse/${userId}`, {
      headers: authHeaders(),
    })

    const warehouses = res.data?.data ?? res.data
    return Array.isArray(warehouses) ? (warehouses as WarehouseData[]) : []
  } catch (error: unknown) {
    const err = error as {
      response?: { data?: ApiErrorResponse }
      message?: string
    }
    const message =
      err.response?.data?.message ||
      err.response?.data?.error ||
      err.message ||
      "Failed to fetch warehouses"

    throw new Error(message)
  }
}
