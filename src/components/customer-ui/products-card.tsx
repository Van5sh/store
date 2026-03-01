"use client"

import Image from "next/image"
import { Eye, ShoppingCart } from "lucide-react"
import { colors } from "@/lib/colors"
import React from "react"

interface ProductProps {
    name: string;
    price: number;
    type: string;
    img: string;
    description?: string;
    stock?: number;
    brand?: string;
    sku?: string;
}

const ProductsCard: React.FC<ProductProps> = ({ name, price, type, img }) => {
    const [open, setOpen] = React.useState(false)
    return (
        <>
        <div
            className="p-4 rounded-lg shadow-md transition-all duration-300 cursor-pointer"
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
            <Image src={img} alt={name} className="w-full h-48 object-cover mb-4 rounded" width={500} height={192}/>
            <h2 className="text-xl font-semibold mb-2" style={{ color: colors.text.primary }}>{name}</h2>
            <p className="mb-1" style={{ color: colors.text.secondary }}>Type: {type}</p>
            <p className="font-bold" style={{ color: colors.amber[600] }}>${price.toFixed(2)}</p>
            <div className='flex flex-row mt-4 justify-end gap-2'>
                <ShoppingCart className="cursor-pointer transition-colors" style={{ color: colors.stone[600] }}
                  onMouseEnter={(e) => e.currentTarget.style.color = colors.amber[600]}
                  onMouseLeave={(e) => e.currentTarget.style.color = colors.stone[600]} />
                <Eye className="cursor-pointer transition-colors" style={{ color: colors.stone[600] }}
                  onMouseEnter={(e) => e.currentTarget.style.color = colors.amber[600]}
                  onMouseLeave={(e) => e.currentTarget.style.color = colors.stone[600]} />
            </div>
        </div>
        {open && (
            <div
                className="fixed inset-0 z-50 flex items-center justify-center p-4"
                style={{ backgroundColor: "rgba(0,0,0,0.4)" }}
                onClick={() => setOpen(false)}
            >
                <div
                    className="w-full max-w-lg rounded-lg p-6"
                    style={{ backgroundColor: colors.background.card }}
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="flex items-start justify-between gap-4 mb-4">
                        <h3 className="text-xl font-semibold" style={{ color: colors.text.primary }}>
                            {name}
                        </h3>
                        <button
                            className="text-sm px-3 py-1 rounded"
                            style={{ border: `1px solid ${colors.border.light}`, color: colors.text.secondary }}
                            onClick={() => setOpen(false)}
                        >
                            Close
                        </button>
                    </div>
                    <Image src={img} alt={name} className="w-full h-56 object-cover rounded mb-4" width={800} height={320}/>
                    <div className="space-y-2">
                        <p style={{ color: colors.text.secondary }}>Type: {type}</p>
                        <p className="font-semibold" style={{ color: colors.amber[600] }}>
                            ${price.toFixed(2)}
                        </p>
                    </div>
                </div>
            </div>
        )}
        </>
    )
}

export default ProductsCard;
