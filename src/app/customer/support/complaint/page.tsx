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
    const handleSubmit = async () => {
        if (!user?.id) {
            alert("Please sign in before submitting a complaint.");
            return;
        }
        const requiredFields = [email, complaintType];
        if (complaintType === "order") {
            requiredFields.push(orderId);
        }
        if (requiredFields.some(field => !field)) {
            alert("Please fill in all required fields.");
            return;
        }
        await newComplaint({
            title,
            content: description,
            deliveryDate: complaintType === "order" ? new Date().toISOString() : undefined,
            orderId: complaintType === "order" ? orderId.trim() : undefined,
            userId: user.id,
            email: email || user?.email || "",
        }, complaintType);
    }

    React.useEffect(() => {
        if (user?.email) {
            setEmail((current) => current || user.email || "")
        }
    }, [user?.email])

    return (
        <div className="max-w-xl mx-auto py-8 px-4">
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

            <div className="mb-6" style={{ height: "1px", backgroundColor: colors.border.light }} />
            <div
                className="rounded-xl p-6 space-y-5"
                style={{ backgroundColor: colors.background.card, border: `1px solid ${colors.border.light}` }}
            >
                <div className="space-y-1.5">
                    <label className="text-sm font-medium" style={{ color: colors.text.primary }}>
                        Complaint Type
                    </label>
                    <Select value={complaintType} onValueChange={(value) => setComplaintType(value as "order" | "general")}>
                        <SelectTrigger
                            className="w-full"
                            style={{ borderColor: colors.border.light, color: colors.text.primary }}
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
                            style={{ borderColor: colors.border.light, color: colors.text.primary }}
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
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
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
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={{ borderColor: colors.border.light, color: colors.text.primary }}
                    />
                </div>

                <div style={{ height: "1px", backgroundColor: colors.border.light }} />

                <Button
                    className="w-full flex items-center justify-center gap-2 font-semibold"
                    onClick={handleSubmit}
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
