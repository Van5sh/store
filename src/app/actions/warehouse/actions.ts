import { apiHandler } from "@/app/utils/ApiHandler"
import type { createWarehouseType } from "@/interfaces/warehouse"

/* =========================
   CREATE WAREHOUSE
========================= */
export async function createWarehouse(data: createWarehouseType) {
  try {
    if (!data) {
      throw new Error("Missing warehouse data")
    }

    const token = localStorage.getItem("auth_token")
    if (!token) {
      throw new Error("Authentication token missing")
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
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
    )

    console.log("✅ Warehouse created:", res.data)

    return res.data
  } catch (error: any) {
    const message =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        "Failed to create warehouse"

    console.error("❌ createWarehouse error:", message)

    throw new Error(message)
  }
}

/* =========================
   GET WAREHOUSES
========================= */
export async function getWarehouses() {
  try {
    const userRaw = localStorage.getItem("auth_user")

    if (!userRaw) {
      throw new Error("User not found in localStorage")
    }

    let userData: { id?: string }

    try {
      userData = JSON.parse(userRaw)
    } catch {
      throw new Error("Invalid auth_user format")
    }

    if (!userData?.id) {
      throw new Error("User ID not found")
    }

    const token = localStorage.getItem("auth_token")
    if (!token) {
      throw new Error("Authentication token missing")
    }

    const res = await apiHandler.get(`/warehouse/${userData.id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    console.log("✅ Warehouses fetched:", res.data)

    return res.data
  } catch (error: any) {
    const message =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        "Failed to fetch warehouses"

    console.error("❌ getWarehouses error:", message)

    throw new Error(message)
  }
}