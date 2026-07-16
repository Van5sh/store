"use client"

export type StoredAuthUser = {
  id: string
  userName?: string
  name?: string
  email?: string
  role?: string
}

export function getStoredAuthUser(): StoredAuthUser | null {
  if (typeof window === "undefined") return null

  const raw = localStorage.getItem("auth_user")
  if (!raw) return null

  try {
    return JSON.parse(raw) as StoredAuthUser
  } catch {
    return null
  }
}

export function getStoredToken(): string | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem("auth_token")
}

export function setStoredAuthUser(user: StoredAuthUser) {
  if (typeof window === "undefined") return
  localStorage.setItem("auth_user", JSON.stringify(user))
}
