import { apiHandler } from "@/app/utils/ApiHandler"
import { getStoredToken } from "@/lib/auth-storage"

export async function deleteProduct(productId: string) {
  if (!productId) throw new Error("Missing productId")
  const token = getStoredToken()
  if (!token) {
    throw new Error("Authentication token missing")
  }
  const res = await apiHandler.delete(`/products/${productId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  return res.data
}
