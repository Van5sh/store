import { NextRequest, NextResponse } from "next/server"
import { apiHandler } from "../../../utils/ApiHandler"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const res = await apiHandler.post("/auth/login", {
      userName: body.userName,
      password: body.password,
    })

    const token = res.data.access_token
    const role = res.data.role

    console.log("Received access token:", token)
    console.log("Received role:", role)

    const response = NextResponse.json(
      { role },
      { status: 200 }
    )

    response.cookies.set("access_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    })

    response.cookies.set("role", role, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    })

    return response
  } catch (error) {
    return NextResponse.json(
      { message: "Invalid credentials" },
      { status: 401 }
    )
  }
}
