import { NextRequest, NextResponse } from "next/server"
import { apiHandler } from "../../../../utils/ApiHandler"

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const res = await apiHandler.get(`/users/${params.id}`)
    return NextResponse.json(res.data, { status: 200 })
  } catch (error: any) {
    if (error.response?.status === 401) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      )
    }

    return NextResponse.json(
      { message: "Error fetching user" },
      { status: 500 }
    )
  }
}
