import { apiHandler } from "@/app/utils/ApiHandler"
import { getStoredAuthUser, getStoredToken } from "@/lib/auth-storage"

export type WarehouseInfo = {
  warehouseId: string
  warehouseName: string
  warehouseCapacity?: number
  remainingSpace?: number
  cityId?: string
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

type StoreProductResponse = {
  storeId: string
  productId: string
  vendorId: string
  product?: ProductItem
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

function normalizeStoreProducts(data: unknown): ProductItem[] {
  if (!Array.isArray(data)) return []

  return data
    .map((item) => {
      const row = item as StoreProductResponse | ProductItem
      return "product" in row && row.product ? row.product : (row as ProductItem)
    })
    .filter((item): item is ProductItem => Boolean(item?.productId))
}

export async function getAllProducts(): Promise<ProductItem[]> {
  const res = await apiHandler.get("/products", {
    headers: authHeaders(),
  })

  return Array.isArray(res.data) ? (res.data as ProductItem[]) : []
}

export async function getStoreProducts(
  storeId: string
): Promise<Array<{ productId: string }>> {
  if (!storeId) throw new Error("Missing storeId")

  const products = await getProductsByStoreId(storeId)
  return products.map((product) => ({ productId: product.productId }))
}

export async function getVendorProducts(): Promise<ProductItem[]> {
  const vendorId = getStoredAuthUser()?.id ?? ""
  if (!vendorId) {
    throw new Error("Vendor not found")
  }

  const res = await apiHandler.get(`/products/vendor/${vendorId}`, {
    headers: authHeaders(),
  })

  return Array.isArray(res.data) ? (res.data as ProductItem[]) : []
}

export async function getProductInventory(
  productId: string
): Promise<ProductInventoryItem[]> {
  if (!productId) throw new Error("Missing productId")

  const res = await apiHandler.get(`/products/details/${productId}`, {
    headers: authHeaders(),
  })

  return Array.isArray(res.data?.inventory)
    ? (res.data.inventory as ProductInventoryItem[])
    : []
}

export async function getProductsByStoreId(storeId: string): Promise<ProductItem[]> {
  if (!storeId) throw new Error("Missing storeId")

  const res = await apiHandler.get(`/products/store/${storeId}`, {
    headers: authHeaders(),
  })

  return normalizeStoreProducts(res.data)
}
