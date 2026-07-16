"use server";

import { apiHandler } from "@/app/utils/ApiHandler";
import { cookies } from "next/headers"

interface ComplaintPayload {
    title: string;    
    content: string;
    deliveryDate?: string;
    orderId?: string;
    email: string;
    userId: string;
    type?: "relatedToOrder" | "general";
}

type ApiErrorResponse = {
    message?: string
    error?: string
}

async function newComplaint(payload: ComplaintPayload, type: "order" | "general") {
    const token = (await cookies()).get("access_token")?.value
    const normalizedUserId = payload.userId?.trim()
    const normalizedOrderId = payload.orderId?.trim() || undefined
    if (!normalizedUserId) {
        throw new Error("User ID is required");
    }
    if (type === "order" && !normalizedOrderId) {
        throw new Error("Order ID is required for order-related complaints");
    }
    try {
        const response = await apiHandler.post(
            "/complaints",
            {
                ...payload,
                userId: normalizedUserId,
                orderId: normalizedOrderId,
                deliveryDate: type === "order" ? payload.deliveryDate : undefined,
                type: type === "order" ? "relatedToOrder" : "general",
            },
            {
                headers: token ? { Authorization: `Bearer ${token}` } : undefined,
            }
        );
        console.log("Complaint submitted successfully:", response);
        return response.data ?? response;
    } catch (error: unknown) {
        const err = error as {
            response?: { data?: ApiErrorResponse }
            message?: string
        }
        const data = err.response?.data
        const message =
            data?.message ??
            data?.error ??
            err.message ??
            "Failed to submit complaint"
        throw new Error(message)
    }
}

export { newComplaint };
