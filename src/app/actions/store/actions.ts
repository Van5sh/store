import { apiHandler } from "@/app/utils/ApiHandler"
import { CreateStoreData } from "@/interfaces/store"
import { getStoredToken } from "@/lib/auth-storage"

export type VendorStore = {
  storeId: string
  storeName: string
  cityName: string
  vendorId: string
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

export async function createStore(storeData: CreateStoreData): Promise<VendorStore> {
  try {
    if (!storeData.storeName || !storeData.cityName || !storeData.vendorId) {
      throw new Error("Missing required store information")
    }

    const response = await apiHandler.post("/store/create", storeData, {
      headers: authHeaders(),
    })

    return response.data as VendorStore
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to create store"
    throw new Error(message)
  }
}

export async function getStores(): Promise<VendorStore[]> {
  const res = await apiHandler.get("/store", {
    headers: authHeaders(),
  })

  const stores = res.data
  return Array.isArray(stores) ? (stores as VendorStore[]) : []
}

export async function getVendorStores(vendorId: string): Promise<VendorStore[]> {
  if (!vendorId) throw new Error("Missing vendorId")

  const stores = await getStores()
  return stores.filter((store) => store.vendorId === vendorId)
}
