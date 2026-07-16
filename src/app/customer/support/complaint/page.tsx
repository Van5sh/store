"use client"
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { colors } from "@/lib/colors";
import { MessageSquareWarning, Send } from "lucide-react";
import React from "react"
import { useAuth } from "@/contexts/AuthContext";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { newComplaint } from "./actions";

const ComplaintPage = () => {
    const { user } = useAuth();
    const [title, setTitle] = React.useState("");
    const [description, setDescription] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [complaintType, setComplaintType] = React.useState<"order" | "general">("order");
    const [orderId, setOrderId] = React.useState("");
    const [submitting, setSubmitting] = React.useState(false)
    const [error, setError] = React.useState<string | null>(null)
    const [success, setSuccess] = React.useState<string | null>(null)
    const handleSubmit = async () => {
        if (!user?.id) {
            setError("Please sign in before submitting a complaint.")
            return;
        }
        const requiredFields = [email, complaintType];
        if (complaintType === "order") {
            requiredFields.push(orderId);
        }
        if (requiredFields.some(field => !field)) {
            setError("Please fill in all required fields.")
            return;
        }
        try {
            setSubmitting(true)
            setError(null)
            setSuccess(null)
            await newComplaint({
                title,
                content: description,
                deliveryDate: complaintType === "order" ? new Date().toISOString() : undefined,
                orderId: complaintType === "order" ? orderId.trim() : undefined,
                userId: user.id,
                email: email || user?.email || "",
            }, complaintType);
            setSuccess("Complaint submitted successfully. Our team will review it shortly.")
            setTitle("")
            setDescription("")
            setOrderId("")
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to submit complaint.")
        } finally {
            setSubmitting(false)
        }
    }

    React.useEffect(() => {
        if (user?.email) {
            setEmail((current) => current || user.email || "")
        }
    }, [user?.email])

    return (
        <div className="max-w-5xl mx-auto py-8 px-4">
            <div
                className="rounded-2xl border p-6 sm:p-8 mb-6"
                style={{
                    background: `linear-gradient(135deg, ${colors.background.card} 0%, ${colors.background.accent} 100%)`,
                    borderColor: colors.border.light,
                }}
            >
                <div className="flex items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold" style={{ color: colors.text.primary }}>
                            Submit a Complaint
                        </h1>
                        <p className="text-sm mt-1" style={{ color: colors.text.secondary }}>
                            We&apos;ll get back to you as soon as possible.
                        </p>
                    </div>
                    <div
                        className="p-3 rounded-xl"
                        style={{ backgroundColor: colors.background.muted, border: `1px solid ${colors.border.light}` }}
                    >
                        <MessageSquareWarning size={20} style={{ color: colors.text.accent }} />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div
                    className="lg:col-span-8 rounded-2xl border p-6 sm:p-7 space-y-5"
                    style={{ backgroundColor: colors.background.card, border: `1px solid ${colors.border.light}` }}
                >
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium" style={{ color: colors.text.primary }}>
                            Complaint Type
                        </label>
                        <Select value={complaintType} onValueChange={(value) => setComplaintType(value as "order" | "general")}>
                            <SelectTrigger
                                className="w-full"
                                style={{ borderColor: colors.border.light, color: colors.text.primary, backgroundColor: colors.background.muted }}
                            >
                                <SelectValue placeholder="Select complaint type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="order">Order</SelectItem>
                                <SelectItem value="general">General</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {complaintType === "order" && (
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium" style={{ color: colors.text.primary }}>
                                Order ID
                            </label>
                            <Input
                                placeholder="e.g. ORD-12345"
                                value={orderId}
                                onChange={(e) => setOrderId(e.target.value)}
                                style={{ borderColor: colors.border.light, color: colors.text.primary, backgroundColor: colors.background.muted }}
                            />
                        </div>
                    )}

                    <div className="space-y-1.5">
                        <label className="text-sm font-medium" style={{ color: colors.text.primary }}>
                            Complaint Title
                        </label>
                        <Input
                            placeholder="Brief summary of the issue"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            style={{ borderColor: colors.border.light, color: colors.text.primary, backgroundColor: colors.background.muted }}
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-sm font-medium" style={{ color: colors.text.primary }}>
                            Description
                        </label>
                        <textarea
                            placeholder="Describe your complaint in detail..."
                            rows={6}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full rounded-md px-3 py-2 text-sm resize-none outline-none focus:ring-2 transition-all"
                            style={{
                                borderColor: colors.border.light,
                                border: `1px solid ${colors.border.light}`,
                                color: colors.text.primary,
                                backgroundColor: colors.background.muted,
                            }}
                            onFocus={(e) => e.currentTarget.style.borderColor = colors.border.accent}
                            onBlur={(e) => e.currentTarget.style.borderColor = colors.border.light}
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-sm font-medium" style={{ color: colors.text.primary }}>
                            Your Email
                        </label>
                        <Input
                            placeholder="email@example.com"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            style={{ borderColor: colors.border.light, color: colors.text.primary, backgroundColor: colors.background.muted }}
                        />
                    </div>

                    <div style={{ height: "1px", backgroundColor: colors.border.light }} />

                    {success ? (
                        <div className="rounded-lg border px-4 py-3 text-sm" style={{ borderColor: colors.border.light, color: colors.text.accent }}>
                            {success}
                        </div>
                    ) : null}
                    {error ? (
                        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                            {error}
                        </div>
                    ) : null}

                    <Button
                        className="w-full flex items-center justify-center gap-2 font-semibold"
                        onClick={handleSubmit}
                        disabled={submitting}
                        style={{ backgroundColor: colors.text.accent, color: colors.text.inverse }}
                    >
                        <Send size={15} />
                        {submitting ? "Submitting..." : "Submit Complaint"}
                    </Button>
                </div>

                <div className="lg:col-span-4 space-y-4">
                    <div
                        className="rounded-2xl border p-5"
                        style={{ backgroundColor: colors.background.card, border: `1px solid ${colors.border.light}` }}
                    >
                        <p className="text-sm font-semibold mb-2" style={{ color: colors.text.primary }}>
                            What helps us resolve faster
                        </p>
                        <div className="space-y-2 text-sm" style={{ color: colors.text.secondary }}>
                            <div className="rounded-lg px-3 py-2" style={{ backgroundColor: colors.background.muted }}>
                                Include the order ID and exact item name.
                            </div>
                            <div className="rounded-lg px-3 py-2" style={{ backgroundColor: colors.background.muted }}>
                                Mention the date and any delivery issues.
                            </div>
                            <div className="rounded-lg px-3 py-2" style={{ backgroundColor: colors.background.muted }}>
                                Provide screenshots or error messages if possible.
                            </div>
                        </div>
                    </div>

                    <div
                        className="rounded-2xl border p-5"
                        style={{ backgroundColor: colors.background.accent, border: `1px solid ${colors.border.light}` }}
                    >
                        <p className="text-sm font-semibold mb-1" style={{ color: colors.text.primary }}>
                            Typical response time
                        </p>
                        <p className="text-sm" style={{ color: colors.text.secondary }}>
                            Within 24–48 hours on business days.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ComplaintPage;
