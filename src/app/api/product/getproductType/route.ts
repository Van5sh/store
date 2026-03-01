import { NextRequest, NextResponse } from "next/server"
import { AxiosError } from "axios"
import { apiHandler } from "../../../utils/ApiHandler"

export async function GET(req: NextRequest) {
  try {
    const typeParam =
      req.nextUrl.searchParams.get("type") ??
      req.nextUrl.searchParams.get("category")
    const type = typeParam?.trim().toLowerCase() ?? ""

    if (!type) {
      return NextResponse.json(
        { message: "Missing required query param: type or category" },
        { status: 400 }
      )
    }

    const authHeader = req.headers.get("authorization")
    const token = authHeader?.startsWith("Bearer ")
      ? authHeader.replace("Bearer ", "")
      : req.cookies.get("access_token")?.value

    const res = await apiHandler.get(
      `/products/type/${(type)}`,
      {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      }
    )

    return NextResponse.json(res.data, { status: 200 })
  } catch (error) {
    const err = error as AxiosError<any>
    const status = err.response?.status ?? 500
    const data = err.response?.data
    const message =
      data?.message ??
      data?.error ??
      (status === 401 ? "Unauthorized" : "Failed to fetch products")

    return NextResponse.json({ message, details: data }, { status })
  }
}
