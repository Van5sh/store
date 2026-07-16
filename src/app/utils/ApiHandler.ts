import axios from "axios"

const baseURL =
  process.env.NEXT_PUBLIC_BACKEND_URL?.replace(/\/+$/, "") ||
  "http://localhost:5100"

export const apiHandler = axios.create({
  baseURL,
  headers: {
    Accept: "application/json",
  },
  timeout: 5000,
})

apiHandler.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("auth_token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
  }

  return config
})
