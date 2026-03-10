import { apiHandler } from "@/app/utils/ApiHandler"
import type { createWarehouseType } from "@/interfaces/warehouse"

// apiHandler.post("/warehouse", data, {
//   headers: {
//     Authorization: `Bearer ${token}`
//   }
// })
export async function createWarehouse(data: createWarehouseType) {

  if (!data) {
    throw new Error("Missing fields")
  }
  const token = localStorage.getItem("token")
  const res = await apiHandler.post("/warehouse", {
    cityName: data.city,
    userId: data.userID,
    warehouseCapacity: data.warehouseCapacity,
    warehouseName: data.warehouseName
  },{
    headers:{
        Authorization: `Bearer ${token}`
    }
  })

  return res.data
}