import { apiHandler } from "@/app/utils/ApiHandler";
import { getStoredToken } from "@/lib/auth-storage";

export type RecentActivityItem = {
  id: string;
  vendorId: string;
  type: string;
  message: string;
  createdAt: string;
  user: {
    userid: string;
    name: string;
    role: string;
  } | null;
};

export type RecentActivityResponse = {
  activities: RecentActivityItem[];
  nextCursor: string | null;
};

export async function getRecentActivity(params?: {
  limit?: number;
  cursor?: string;
}): Promise<RecentActivityResponse> {
  const token = getStoredToken();
  const { data } = await apiHandler.get<RecentActivityResponse>(
    "/activity/recent",
    {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      params: {
        ...(params?.limit !== undefined && { limit: params.limit }),
        ...(params?.cursor && { cursor: params.cursor }),
      },
    }
  );

  return data;
}
