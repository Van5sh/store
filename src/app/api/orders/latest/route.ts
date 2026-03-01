import { NextRequest, NextResponse } from "next/server"
import { AxiosError } from "axios"
import { apiHandler } from "../../../utils/ApiHandler"

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization")
    const token = authHeader?.startsWith("Bearer ")
      ? authHeader.replace("Bearer ", "")
      : req.cookies.get("access_token")?.value

    const limit = req.nextUrl.searchParams.get("limit") ?? "10"
    const res = await apiHandler.get(`/order/latest?limit=${limit}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    })
    return NextResponse.json(res.data, { status: 200 })
  } catch (error) {
    const err = error as AxiosError<any>
    const status = err.response?.status ?? 500
    const data = err.response?.data
    const message =
      data?.message ??
      data?.error ??
      (status === 401 ? "Unauthorized" : "Failed to fetch orders")

    return NextResponse.json({ message, details: data }, { status })
  }
}
