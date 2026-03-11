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

export async function getWarehouses(){
  const user=localStorage.getItem("auth_user")
  if (!user) {
    throw new Error("User not found")
  }
  const userData=JSON.parse(user)
  if (!userData.id) {
    throw new Error("User ID not found")
  }
  const id=userData.id
  const res=await apiHandler.get(`/warehouse/${id}`,{
    headers:{
      Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
    }
  })
  return res.data
}