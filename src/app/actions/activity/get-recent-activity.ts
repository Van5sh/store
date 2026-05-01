import { apiHandler } from "@/app/utils/ApiHandler"

export type RecentActivityItem = {
  id: string
  vendorId: string
  type: string
  message: string
  createdAt: string
}

export async function getRecentActivity(params?: {
  limit?: number
  cursor?: string
}) {
  const limit = params?.limit
  const cursor = params?.cursor

  const res = await apiHandler.get("/activity/recent", {
    params: {
      ...(limit != null ? { limit } : {}),
      ...(cursor ? { cursor } : {}),
    },
    headers: {
      Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
    },
  })

  return res.data as { activities: RecentActivityItem[]; nextCursor: string | null }
}

