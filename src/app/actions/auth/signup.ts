"use server"

import { cookies } from "next/headers"
import { AxiosError } from "axios"
import { apiHandler } from "@/app/utils/ApiHandler"

type SignupInput = {
  userName: string
  password: string
  email: string
  role: "customer" | "vendor" | "admin"
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

export async function signup(
  payload: SignupInput
): Promise<AuthResponse> {
  try {
    const res = await apiHandler.post("/auth/signup", {
      userName: payload.userName,
      password: payload.password,
      role: payload.role,
      email: payload.email,
    })

    const data = res.data ?? {}
    const token = data.access_token

    const newUser = data.newUser ?? data.user ?? {}
    const user: UserData = {
      id: newUser.id ?? newUser.userId ?? data.id,
      userName: newUser.userName ?? data.userName,
      name: newUser.name ?? data.name ?? newUser.userName,
      email: newUser.email ?? data.email,
      role:
        newUser.role ??
        data.role ??
        data.newUser?.role ??
        data.user?.role,
    }

    const role = user.role

    if (!role || !user.id) {
      throw new Error("Invalid signup response from server")
    }

    const cookieStore = await cookies()
    if (token) {
      cookieStore.set("access_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
      })
    }

    cookieStore.set("role", role, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    })

    return { role, access_token: token, user }
  } catch (error) {
    const err = error as AxiosError<any>
    const status = err.response?.status ?? 500
    const data = err.response?.data
    const message =
      data?.message ??
      data?.error ??
      (status === 409 ? "User already exists" : "Signup failed")

    throw new Error(message)
  }
}
