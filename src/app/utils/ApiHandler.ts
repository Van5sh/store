import axios from "axios"

export const apiHandler = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 5000,
})

apiHandler.interceptors.request.use((config) => {
  const token = localStorage.getItem("auth_token")

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})