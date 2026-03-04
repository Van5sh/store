import { NextRequest, NextResponse } from "next/server"
import { AxiosError } from "axios"
import { apiHandler } from "../../../utils/ApiHandler"

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization")
    const token = authHeader?.startsWith("Bearer ")
      ? authHeader.replace("Bearer ", "")
      : req.cookies.get("access_token")?.value

    const userId = req.nextUrl.searchParams.get("userId")
    if (!userId) {
      return NextResponse.json(
        { message: "User ID is required" },
        { status: 400 }
      )
    }

    const statusParam = req.nextUrl.searchParams.get("status") ?? "delivered"
    const statuses = statusParam
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)

    if (statuses.length === 0) {
      return NextResponse.json(
        { message: "At least one status is required" },
        { status: 400 }
      )
    }

    const results = await Promise.all(
      statuses.map((status) =>
        apiHandler.get(`/order/user/${userId}/history/${status}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        })
      )
    )

    const orders = results.flatMap((res) =>
      Array.isArray(res.data?.orders)
        ? res.data.orders
        : Array.isArray(res.data)
        ? res.data
        : []
    )

    return NextResponse.json({ orders }, { status: 200 })
  } catch (error) {
    const err = error as AxiosError<any>
    const status = err.response?.status ?? 500
    const data = err.response?.data
    const message =
      data?.message ??
      data?.error ??
      (status === 401 ? "Unauthorized" : "Failed to fetch order history")

    return NextResponse.json({ message, details: data }, { status })
  }
}
