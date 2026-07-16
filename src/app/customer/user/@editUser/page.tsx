"use client"

import React from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { colors } from "@/lib/colors"
import { useAuth } from "@/contexts/AuthContext"
import { updateUser } from "@/app/actions/users/update-user"
import { setStoredAuthUser } from "@/lib/auth-storage"

export default function EditUserSlot() {
  const { user } = useAuth()
  const [name, setName] = React.useState(user?.name || user?.userName || "")
  const [email, setEmail] = React.useState(user?.email || "")
  const [saving, setSaving] = React.useState(false)
  const [message, setMessage] = React.useState<string | null>(null)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    setName(user?.name || user?.userName || "")
    setEmail(user?.email || "")
  }, [user?.name, user?.userName, user?.email])

  const handleSave = async () => {
    if (!user?.id) {
      setError("Please sign in to update your profile.")
      return
    }

    setSaving(true)
    setError(null)
    setMessage(null)

    try {
      const updated = await updateUser({ id: user.id, name, email })
      setStoredAuthUser({
        id: user.id,
        role: user.role,
        name: updated?.name ?? name,
        userName: updated?.name ?? name,
        email: updated?.email ?? email,
      })
      setMessage("Profile updated successfully.")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update profile.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-xl font-semibold" style={{ color: colors.text.primary }}>Edit Profile</h3>
        <p className="mt-1 text-sm" style={{ color: colors.text.secondary }}>
          Update the account details used across your customer session.
        </p>
      </div>

      <div className="grid gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium" style={{ color: colors.text.primary }}>Display Name</label>
          <Input value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium" style={{ color: colors.text.primary }}>Email</label>
          <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
      </div>

      {message ? <div className="rounded-lg border px-4 py-3 text-sm" style={{ borderColor: colors.border.light, color: colors.text.accent }}>{message}</div> : null}
      {error ? <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div> : null}

      <Button onClick={handleSave} disabled={saving}>
        {saving ? "Saving..." : "Save Changes"}
      </Button>
    </div>
  )
}
