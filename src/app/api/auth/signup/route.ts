import { NextRequest, NextResponse } from "next/server"
import { AxiosError } from "axios"
import { apiHandler } from "@/app/utils/ApiHandler"

export async function POST(req: NextRequest) {
    try {
        const body = await req.json()

        const res = await apiHandler.post("/auth/signup", {
            userName: body.userName,
            password: body.password,
            role: body.role,
            email: body.email,
        })

        const token = res.data?.access_token
        const role = res.data?.role ?? res.data?.newUser?.role

        const newUser = res.data?.newUser ?? res.data?.user ?? {}
        const user = {
            id: newUser.id ?? newUser.userId ?? res.data?.id,
            userName: newUser.userName ?? res.data?.userName,
            name: newUser.name ?? res.data?.name ?? newUser.userName,
            email: newUser.email ?? res.data?.email,
            role,
        }

        if (!token || !role || !user.id) {
            return NextResponse.json(
                { message: "Invalid signup response from server" },
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
            (status === 409 ? "User already exists" : "Signup failed")

        return NextResponse.json({ message, details: data }, { status })
    }
}
