import { NextRequest, NextResponse } from "next/server"
import { AxiosError } from "axios"
import { apiHandler } from "../../../utils/ApiHandler"

export async function GET(req: NextRequest) {
  try {
    const res=await apiHandler.get("/orders/latest")
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
