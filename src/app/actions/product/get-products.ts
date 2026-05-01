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


export async function getVendorProducts(): Promise<ProductItem[]> {
  let vendorId = ""
  if (typeof window !== "undefined") {
      const userRaw = localStorage.getItem("auth_user")
      if (userRaw) {
          try {
            const parsed = JSON.parse(userRaw) as { id?: string }
            console.log("Parsed auth_user from localStorage:", parsed)
            vendorId = parsed?.id ?? ""
          } catch (e) {
              console.log("Failed to parse auth_user from localStorage, using empty vendorId", e)
          }
        } else {
            console.log("No auth_user found in localStorage, using empty vendorId")
        }
      }
  if (!vendorId) {
    console.warn("Vendor ID is empty, getVendorProducts will likely fail")
  }
  const res = await apiHandler.get(`/products/vendor/${vendorId}`, {
    headers: {  Authorization: `Bearer ${localStorage.getItem("auth_token")}` },
  })
  return (res.data ?? []) as ProductItem[]
}

export async function getProductInventory(productId: string): Promise<ProductInventoryItem[]> {
  if (!productId) throw new Error("Missing productId")
  const res = await apiHandler.get(`/inventory/product/${productId}`, {
    headers: {  Authorization: `Bearer ${localStorage.getItem("auth_token")}` },
  })
  return (res.data ?? []) as ProductInventoryItem[]
}