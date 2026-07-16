"use server"

import { AxiosError } from "axios"
import { apiHandler } from "@/app/utils/ApiHandler"
import { login } from "./login"

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

export async function signup(payload: SignupInput): Promise<AuthResponse> {
  try {
    await apiHandler.post("/auth/signup", {
      userName: payload.userName,
      password: payload.password,
      role: payload.role,
      email: payload.email,
    })

    // The backend signup token does not include the same claims as login.
    // Log in immediately to obtain the full session payload used by protected routes.
    return login({
      userName: payload.userName,
      password: payload.password,
    })
  } catch (error) {
    const err = error as AxiosError<{ message?: string; error?: string }>
    const status = err.response?.status ?? 500
    const data = err.response?.data
    const message =
      data?.message ??
      data?.error ??
      (status === 409 ? "User already exists" : "Signup failed")

    throw new Error(message)
  }
}
