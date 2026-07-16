"use server"

import { cookies } from "next/headers"
import { AxiosError } from "axios"
import { apiHandler } from "@/app/utils/ApiHandler"

type ApiErrorResponse = {
  message?: string
  error?: string
}

type LoginInput = {
  userName: string
  password: string
}

type UserData = {
  id: string
  userName?: string
  name?: string
  email?: string
  role: string
}

type AuthResponse = {
  role: string
  access_token?: string
  user: UserData
}

export async function login(payload: LoginInput): Promise<AuthResponse> {
  const userName = payload.userName?.trim()
  const password = payload.password

  if (!userName || !password) {
    throw new Error("Username and password are required")
  }

  try {
    const res = await apiHandler.post("/auth/login", {
      userName,
      password,
    })

    const data = res.data ?? {}
    const user: UserData = {
      id: data.id,
      userName: data.userName ?? data.name,
      name: data.name,
      email: data.email,
      role: data.role,
    }

    if (!user.id || !data.role) {
      throw new Error("Invalid login response from server")
    }

    const cookieStore = await cookies()
    if (data.access_token) {
      cookieStore.set("access_token", data.access_token, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
      })
    }

    if (data.role) {
      cookieStore.set("role", data.role, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
      })
    }

    return {
      role: data.role,
      access_token: data.access_token,
      user,
    }
  } catch (error) {
    const err = error as AxiosError<ApiErrorResponse>
    const status = err.response?.status ?? 500
    const data = err.response?.data
    const message =
      data?.message ??
      data?.error ??
      (status === 401 ? "Unauthorized" : "Login failed")

    throw new Error(message)
  }
}
