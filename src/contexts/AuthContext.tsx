"use client"
import React from "react"
import { login as loginAction } from "@/app/actions/auth/login"
import { logout as logoutAction } from "@/app/actions/auth/logout"
import { signup as signupAction } from "@/app/actions/auth/signup"

type UserData = {
  id: string
  userName?: string
  name?: string
  email?: string
  role: string
}

type AuthPayload = {
  user: UserData
  accessToken?: string
}

type LoginInput = {
  userName: string
  password: string
}

type SignupInput = {
  userName: string
  password: string
  email: string
  role: "customer" | "vendor" | "admin"
}

type AuthResponse = {
  role: string
  user: UserData
  access_token?: string
}

type AuthContextType = {
  isAuthenticated: boolean
  user: UserData
  accessToken: string | null
  login: (payload: LoginInput) => Promise<AuthResponse>
  signup: (payload: SignupInput) => Promise<AuthResponse>
  logout: () => void
}

const STORAGE_USER_KEY = "auth_user"
const STORAGE_TOKEN_KEY = "auth_token"

const DEFAULT_USER: UserData = {
  id: "",
  role: "",
  email: "",
  name: "",
  userName: "",
}

const AuthContext = React.createContext<AuthContextType>({
  isAuthenticated: false,
  user: DEFAULT_USER,
  accessToken: null,
  login: async () => {
    throw new Error("AuthContext not ready")
  },
  signup: async () => {
    throw new Error("AuthContext not ready")
  },
  logout: () => {},
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<UserData>(DEFAULT_USER)
  const [accessToken, setAccessToken] = React.useState<string | null>(null)
  const [isAuthenticated, setIsAuthenticated] = React.useState(false)

  React.useEffect(() => {
    const storedUser = localStorage.getItem(STORAGE_USER_KEY)
    const storedToken = localStorage.getItem(STORAGE_TOKEN_KEY)

    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser) as UserData
        setUser(parsed)
        setIsAuthenticated(true)
      } catch {
        localStorage.removeItem(STORAGE_USER_KEY)
      }
    }

    if (storedToken) {
      setAccessToken(storedToken)
    }
  }, [])

  const cacheAuth = React.useCallback(({ user, accessToken }: AuthPayload) => {
    setUser(user)
    setIsAuthenticated(true)

    localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(user))

    if (accessToken) {
      setAccessToken(accessToken)
      localStorage.setItem(STORAGE_TOKEN_KEY, accessToken)
    }
  }, [])

  const handleAuthResponse = React.useCallback(
    (data: AuthResponse) => {
      if (!data?.user || !data?.role) {
        throw new Error("Invalid auth response")
      }

      cacheAuth({ user: data.user, accessToken: data.access_token })
      return data
    },
    [cacheAuth]
  )

  const login = React.useCallback(
    async (payload: LoginInput) => {
      const data = await loginAction(payload)
      return handleAuthResponse(data)
    },
    [handleAuthResponse]
  )

  const signup = React.useCallback(
    async (payload: SignupInput) => {
      const data = await signupAction(payload)
      return handleAuthResponse(data)
    },
    [handleAuthResponse]
  )

  const logout = React.useCallback(() => {
    setUser(DEFAULT_USER)
    setAccessToken(null)
    setIsAuthenticated(false)

    localStorage.removeItem(STORAGE_USER_KEY)
    localStorage.removeItem(STORAGE_TOKEN_KEY)

    void logoutAction()
  }, [])

  const value = React.useMemo(
    () => ({ isAuthenticated, user, accessToken, login, signup, logout }),
    [isAuthenticated, user, accessToken, login, signup, logout]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return React.useContext(AuthContext)
}
