import { NextRequest, NextResponse } from "next/server"
import { AxiosError } from "axios"
import { apiHandler } from "../../../utils/ApiHandler"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/login`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userName: body.userName,
          password: body.password,
        }),
      }
    )

    const data = await res.json()

    if (!res.ok) {
      return NextResponse.json(
        { message: data?.message ?? "Login failed" },
        { status: res.status }
      )
    }

    const user = {
      id: data.id,
      userName: data.name,
      name: data.name,
      email: data.email,
      role: data.role,
    }

    const response = NextResponse.json(
      {
        role: data.role,
        access_token: data.access_token,
        user,
      },
      { status: 200 }
    )

    if (data.access_token) {
      response.cookies.set("access_token", data.access_token, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
      })
    }

    if (data.role) {
      response.cookies.set("role", data.role, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
      })
    }

    return response
  } catch (error) {
    return NextResponse.json(
      { message: "Login failed" },
      { status: 500 }
    )
  }
}
