"use client"
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { colors } from "@/lib/colors";
import { MessageSquareWarning, Send } from "lucide-react";
import React from "react"

const ComplaintPage = () => {
    return (
        <div className="max-w-xl mx-auto py-8 px-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold" style={{ color: colors.text.primary }}>
                        Submit a Complaint
                    </h1>
                    <p className="text-sm mt-0.5" style={{ color: colors.text.secondary }}>
                        We'll get back to you as soon as possible.
                    </p>
                </div>
                <div
                    className="p-2.5 rounded-xl"
                    style={{ backgroundColor: colors.amber[50], border: `1px solid ${colors.border.light}` }}
                >
                    <MessageSquareWarning size={20} style={{ color: colors.amber[600] }} />
                </div>
            </div>

            {/* Divider */}
            <div className="mb-6" style={{ height: "1px", backgroundColor: colors.border.light }} />

            {/* Form card */}
            <div
                className="rounded-xl p-6 space-y-5"
                style={{ backgroundColor: colors.background.card, border: `1px solid ${colors.border.light}` }}
            >
                <div className="space-y-1.5">
                    <label className="text-sm font-medium" style={{ color: colors.text.primary }}>
                        Complaint Title
                    </label>
                    <Input
                        placeholder="Brief summary of the issue"
                        style={{ borderColor: colors.border.light, color: colors.text.primary }}
                    />
                </div>

                <div className="space-y-1.5">
                    <label className="text-sm font-medium" style={{ color: colors.text.primary }}>
                        Description
                    </label>
                    <textarea
                        placeholder="Describe your complaint in detail..."
                        rows={5}
                        className="w-full rounded-md px-3 py-2 text-sm resize-none outline-none focus:ring-2 transition-all"
                        style={{
                            borderColor: colors.border.light,
                            border: `1px solid ${colors.border.light}`,
                            color: colors.text.primary,
                            backgroundColor: "transparent",
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
                        style={{ borderColor: colors.border.light, color: colors.text.primary }}
                    />
                </div>

                {/* Divider */}
                <div style={{ height: "1px", backgroundColor: colors.border.light }} />

                <Button
                    className="w-full flex items-center justify-center gap-2 font-semibold"
                    style={{ backgroundColor: colors.amber[600], color: "white" }}
                >
                    <Send size={15} />
                    Submit Complaint
                </Button>
            </div>
        </div>
    )
}

export default ComplaintPage;