import { NextResponse } from "next/server"
import { apiHandler } from "../../../utils/ApiHandler"

export async function GET() {
  try {
    const res = await apiHandler.get("/users")
    return NextResponse.json(res.data, { status: 200 })
  } catch (error: any) {
    if (error.response?.status === 401) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      )
    }

    return NextResponse.json(
      { message: "Error fetching users" },
      { status: 500 }
    )
  }
}
