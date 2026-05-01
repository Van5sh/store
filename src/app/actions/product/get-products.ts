import { apiHandler } from "@/app/utils/ApiHandler"

export type WarehouseInfo = {
  warehouseId: string
  warehouseName: string
}

export type ProductInventoryItem = {
  warehouseId: string
  productId: string
  quantity: number
  warehouse?: WarehouseInfo
}

export type ProductItem = {
  productId: string
  productName: string
  productPrice: number
  productPhoto: string
  photoKey: string
  category: string
  inventory?: ProductInventoryItem[]
}

export async function getAllProducts(): Promise<ProductItem[]> {
  const res = await apiHandler.get("/products", {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
    },
  })
  return (res.data ?? []) as ProductItem[]
}

export async function getStoreProducts(storeId: string): Promise<Array<{ productId: string }>> {
  if (!storeId) throw new Error("Missing storeId")
  const res = await apiHandler.get(`/products/store/${storeId}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
    },
  })
  return (res.data ?? []) as Array<{ productId: string }>
}

