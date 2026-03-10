import { apiHandler } from "@/app/utils/ApiHandler"
import type { createWarehouseType } from "@/interfaces/warehouse"

export async function createWarehouse(data: createWarehouseType) {

  if (!data) {
    throw new Error("Missing fields")
  }

  const token = localStorage.getItem("auth_token")

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

  return res.data
}