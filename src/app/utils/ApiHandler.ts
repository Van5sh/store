import axios from "axios"

export const apiHandler = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
  headers: {
    Accept: "application/json",
    // // Avoid ngrok browser warning HTML being returned to XHR/fetch
    // "ngrok-skip-browser-warning": "true",
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
