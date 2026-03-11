"use client"
import React from "react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"

export default function LoginPage() {
  const router = useRouter()
  const { login, signup } = useAuth()

  const [userName, setUserName] = React.useState("")
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [role, setRole] = React.useState<"customer" | "vendor" |"admin">("customer")
  const [isSignup, setIsSignup] = React.useState(false)
  const [loading, setLoading] = React.useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const data = isSignup
        ? await signup({ userName, password, email, role })
        : await login({ userName, password })
      if (data?.role) {
        router.replace(`/${data.role}`)
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Authentication failed"
      alert(message)
    } finally {
      setLoading(false)
    }
  }

  return (
      <div className="flex min-h-screen flex-col justify-center items-center bg-zinc-50 dark:bg-black p-4">
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle>
              {isSignup ? "Create an account" : "Login to your account"}
            </CardTitle>  
            <CardDescription>
              {isSignup
                  ? "Choose a role and create your account"
                  : "Enter your credentials to login"}
            </CardDescription>
            <CardAction>
              <Button
                  variant="link"
                  onClick={() => setIsSignup(!isSignup)}
              >
                {isSignup ? "Login" : "Sign Up"}
              </Button>
            </CardAction>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit}>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Label>Username</Label>
                  <Input
                      type="text"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      required
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Password</Label>
                  <Input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                  />
                </div>
                {isSignup && (
                    <div className="grid gap-2">
                      <Label>Email</Label>
                      <Input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                      />
                    </div>
                )}

                {isSignup && (
                    <div className="grid gap-2">
                      <Label>Role</Label>
                      <select
                          className="border rounded px-3 py-2"
                          value={role}
                          onChange={(e) =>
                              setRole(e.target.value as "customer" | "vendor" |"admin" )
                          }
                      >
                        <option value="customer">Customer</option>
                        <option value="vendor">Vendor</option>
                      </select>
                    </div>
                )}
              </div>

              <Button
                  type="submit"
                  className="w-full mt-6"
                  disabled={loading}
              >
                {loading
                    ? isSignup
                        ? "Creating account..."
                        : "Logging in..."
                    : isSignup
                        ? "Sign Up"
                        : "Login"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
  )
}
