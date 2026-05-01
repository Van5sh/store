import { apiHandler } from "@/app/utils/ApiHandler"

export async function deleteProduct(productId: string) {
  if (!productId) throw new Error("Missing productId")
  const res = await apiHandler.delete(`/products/${productId}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
    },
  })
  return res.data
}

