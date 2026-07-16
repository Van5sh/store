"use client"
import React from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { Eye, EyeOff, Loader2 } from "lucide-react"

const ROLES = [
  {
    value: "customer",
    label: "Customer",
    description: "Browse & buy products",
    icon: "🛍️",
  },
  {
    value: "vendor",
    label: "Vendor",
    description: "Sell & manage inventory",
    icon: "🏪",
  },
]

export default function LoginPage() {
  const router = useRouter()
  const { login, signup } = useAuth()

  const [userName, setUserName] = React.useState("")
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [role, setRole] = React.useState<"customer" | "vendor" | "admin">("customer")
  const [isSignup, setIsSignup] = React.useState(false)
  const [loading, setLoading] = React.useState(false)
  const [showPassword, setShowPassword] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const data = isSignup
          ? await signup({ userName, password, email, role })
          : await login({ userName, password })
      if (data?.role) {
        router.replace(`/${data.role}`)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Authentication failed")
    } finally {
      setLoading(false)
    }
  }

  const toggle = () => {
    setIsSignup((v) => !v)
    setError(null)
  }

  return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center p-4">
        {/* Subtle background grid */}
        <div
            className="fixed inset-0 pointer-events-none opacity-[0.03]"
            style={{
              backgroundImage:
                  "linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
        />

        <div className="relative w-full max-w-md">
          {/* Logo / Brand */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gray-900 mb-4">
              <span className="text-xl">⚡</span>
            </div>
            <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">
              {isSignup ? "Create your account" : "Welcome back"}
            </h1>
            <p className="text-sm text-gray-400 mt-1">
              {isSignup
                  ? "Join thousands of buyers and sellers"
                  : "Sign in to continue to your dashboard"}
            </p>
          </div>

          {/* Card */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-xl shadow-gray-100/60 p-8">
            <form onSubmit={handleSubmit} noValidate>
              <div className="space-y-4">

                {/* Username */}
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Username
                  </Label>
                  <Input
                      type="text"
                      placeholder="your_username"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      required
                      className="rounded-xl border-gray-200 bg-gray-50 focus:bg-white h-11 text-sm transition-colors"
                  />
                </div>

                {/* Email — signup only */}
                {isSignup && (
                    <div className="space-y-1.5">
                      <Label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </Label>
                      <Input
                          type="email"
                          placeholder="you@example.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          className="rounded-xl border-gray-200 bg-gray-50 focus:bg-white h-11 text-sm transition-colors"
                      />
                    </div>
                )}

                {/* Password */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Password
                    </Label>
                    {!isSignup && (
                        <a
                            href="mailto:support@example.com?subject=Password%20Reset%20Request"
                            className="text-xs text-gray-400 hover:text-gray-700 transition-colors"
                        >
                          Need help signing in?
                        </a>
                    )}
                  </div>
                  <div className="relative">
                    <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="rounded-xl border-gray-200 bg-gray-50 focus:bg-white h-11 text-sm pr-10 transition-colors"
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword((v) => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>

                {/* Role selector — signup only */}
                {isSignup && (
                    <div className="space-y-1.5">
                      <Label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                        I want to
                      </Label>
                      <div className="grid grid-cols-2 gap-3">
                        {ROLES.map((r) => (
                            <button
                                key={r.value}
                                type="button"
                                onClick={() => setRole(r.value as typeof role)}
                                className={`flex flex-col items-start gap-1 p-3.5 rounded-xl border text-left transition-all
                          ${role === r.value
                                    ? "border-gray-900 bg-gray-900 text-white"
                                    : "border-gray-200 bg-gray-50 hover:border-gray-300 hover:bg-white text-gray-700"
                                }`}
                            >
                              <span className="text-lg leading-none">{r.icon}</span>
                              <span className="text-sm font-medium">{r.label}</span>
                              <span
                                  className={`text-[11px] leading-snug ${
                                      role === r.value ? "text-gray-300" : "text-gray-400"
                                  }`}
                              >
                          {r.description}
                        </span>
                            </button>
                        ))}
                      </div>
                    </div>
                )}

                {/* Error */}
                {error && (
                    <div className="px-3.5 py-2.5 rounded-xl bg-red-50 border border-red-100 text-sm text-red-600">
                      {error}
                    </div>
                )}

                {/* Submit */}
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full h-11 rounded-xl bg-gray-900 text-white text-sm font-medium
                  hover:bg-gray-700 active:scale-[0.98] transition-all duration-150
                  disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
                >
                  {loading ? (
                      <>
                        <Loader2 size={15} className="animate-spin" />
                        {isSignup ? "Creating account…" : "Signing in…"}
                      </>
                  ) : isSignup ? "Create account" : "Sign in"}
                </button>
              </div>
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-100" />
              </div>
              <div className="relative flex justify-center">
              <span className="bg-white px-3 text-xs text-gray-400">
                {isSignup ? "Already have an account?" : "New here?"}
              </span>
              </div>
            </div>

            <button
                type="button"
                onClick={toggle}
                className="w-full h-10 rounded-xl border border-gray-200 text-sm font-medium text-gray-700
              hover:bg-gray-50 transition-all"
            >
              {isSignup ? "Sign in instead" : "Create an account"}
            </button>
          </div>

          {/* Footer note */}
          <p className="text-center text-xs text-gray-400 mt-6">
            By continuing you agree to our{" "}
            <a href="/customer/support/faq" className="underline underline-offset-2 hover:text-gray-700 transition-colors">
              Terms
            </a>{" "}
            &{" "}
            <a href="/customer/support/contact" className="underline underline-offset-2 hover:text-gray-700 transition-colors">
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
  )
}
