import { NextRequest, NextResponse } from "next/server"
import { AxiosError } from "axios"
import { apiHandler } from "../../../utils/ApiHandler"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const res = await apiHandler.post("/auth/login", {
      userName: body.userName,
      password: body.password,
    })

    if (res.data?.status === "error") {
      return NextResponse.json(
        { message: res.data.message ?? "Login failed" },
        { status: res.data.statusCode ?? 401 }
      )
    }

    const token = res.data.access_token
    const role = res.data.role ?? res.data.user?.role

    const user = {
      id: res.data.id ?? res.data.userId ?? res.data.user?.id,
      userName: res.data.userName ?? res.data.user?.userName,
      name: res.data.name ?? res.data.user?.name ?? res.data.userName,
      email: res.data.email ?? res.data.user?.email,
      role,
    }

    console.log("Received access token:", token)
    console.log("Received role:", role)

    if (!token || !role || !user.id) {
      return NextResponse.json(
        { message: "Invalid login response from server" },
        { status: 502 }
      )
    }

    const response = NextResponse.json(
      { role, access_token: token, user },
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
    const err = error as AxiosError<any>
    const status = err.response?.status ?? 500
    const data = err.response?.data
    const message =
      data?.message ??
      data?.error ??
      (status === 401 ? "Invalid credentials" : "Login failed")

    return NextResponse.json({ message, details: data }, { status })
  }
}
