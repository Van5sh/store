"use client"

import Image from "next/image"
import { Button } from "../ui/button"
import { Eye, ShoppingCart } from "lucide-react"
import { colors } from "@/lib/colors"
import { useAuth } from "@/contexts/AuthContext"
import React from "react"

interface ProductProps {
    id: string;
    name: string;
    price: number;
    type: string;
    img: string;
    description?: string;
    stock?: number;
    brand?: string;
    sku?: string;
}

const ProductsCard: React.FC<ProductProps> = ({ id, name, price, type, img }) => {
    const [open, setOpen] = React.useState(false)
    const [ordering, setOrdering] = React.useState(false)
    const { user } = useAuth()

    const handleOrderNow = async (e: React.MouseEvent) => {
        e.stopPropagation()
        if (!user?.id) {
            alert("Please login to place an order")
            return
        }
        try {
            setOrdering(true)
            const { createOrder } = await import("@/app/customer/products/[type]/actions")
            await createOrder({ productId: id, quantity: 1, userId: user.id })
            alert("Order placed successfully")
        } catch (err) {
            const message = err instanceof Error ? err.message : "Failed to place order"
            alert(message)
        } finally {
            setOrdering(false)
        }
    }
    return (
        <>
        <div
            className="p-4 rounded-xl shadow-md transition-all duration-300 cursor-pointer group"
            style={{ 
                backgroundColor: colors.background.card,
                border: `1px solid ${colors.border.light}`
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = colors.border.accent;
                e.currentTarget.style.boxShadow = `0 10px 15px -3px ${colors.amber[200]}40`;
                e.currentTarget.style.transform = 'translateY(-4px)';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = colors.border.light;
                e.currentTarget.style.boxShadow = '';
                e.currentTarget.style.transform = '';
            }}
            onClick={() => setOpen(true)}
        >
            <div className="relative">
                <Image src={img} alt={name} className="w-full h-48 object-cover mb-4 rounded-lg" width={500} height={192}/>
            </div>
            <div className="flex items-start justify-between gap-3">
                <h2 className="text-lg font-semibold leading-tight" style={{ color: colors.text.primary }}>{name}</h2>
                <p className="font-bold" style={{ color: colors.amber[600] }}>${price.toFixed(2)}</p>
            </div>
            <p className="mt-1 text-sm" style={{ color: colors.text.secondary }}>
                Premium quality, ready to ship.
            </p>
            <div className="flex items-center justify-end mt-4 gap-3">
                <div className='flex flex-row gap-2'>
                    <ShoppingCart className="cursor-pointer transition-colors" style={{ color: colors.stone[600] }}
                      onMouseEnter={(e) => e.currentTarget.style.color = colors.amber[600]}
                      onMouseLeave={(e) => e.currentTarget.style.color = colors.stone[600]} />
                    <Eye className="cursor-pointer transition-colors" style={{ color: colors.stone[600] }}
                      onMouseEnter={(e) => e.currentTarget.style.color = colors.amber[600]}
                      onMouseLeave={(e) => e.currentTarget.style.color = colors.stone[600]} />
                </div>
            </div>
        </div>
        {open && (
            <div
                className="fixed inset-0 z-50 flex items-center justify-center p-4"
                style={{ backgroundColor: "rgba(0,0,0,0.4)" }}
                onClick={() => setOpen(false)}
            >
                <div
                    className="w-full max-w-lg rounded-xl overflow-hidden"
                    style={{ backgroundColor: colors.background.card, boxShadow: `0 25px 50px -12px rgba(0,0,0,0.3)` }}
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="relative">
                        <Image src={img} alt={name} className="w-full h-64 object-cover" width={800} height={320}/>
                        <div
                            className="absolute top-3 left-3 text-xs px-2 py-1 rounded-full font-medium"
                            style={{ backgroundColor: colors.amber[50], color: colors.amber[700], border: `1px solid ${colors.border.light}` }}
                        >
                            {type}
                        </div>
                        <button
                            className="absolute top-3 right-3 text-sm px-3 py-1 rounded-full font-medium"
                            style={{ backgroundColor: "rgba(0,0,0,0.5)", color: "white", backdropFilter: "blur(4px)" }}
                            onClick={() => setOpen(false)}
                        >
                            ✕
                        </button>
                    </div>
                    <div className="p-6">
                        <div className="flex items-start justify-between gap-4 mb-3">
                            <h3 className="text-xl font-semibold" style={{ color: colors.text.primary }}>
                                {name}
                            </h3>
                            <p className="text-lg font-bold" style={{ color: colors.amber[600] }}>
                                ${price.toFixed(2)}
                            </p>
                        </div>
                        <p className="text-sm mb-6" style={{ color: colors.text.secondary }}>
                            Premium quality, ready to ship.
                        </p>
                        <Button
                            className="w-full py-3 text-base font-semibold rounded-lg transition-opacity hover:opacity-90"
                            style={{ backgroundColor: colors.amber[600], color: "white" }}
                            onClick={handleOrderNow}
                            disabled={ordering}
                        >
                            {ordering ? "Ordering..." : "Order Now"}
                        </Button>
                    </div>
                </div>
            </div>
        )}
        </>
    )
}

export default ProductsCard;
