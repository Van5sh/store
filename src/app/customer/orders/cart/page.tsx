import { ShoppingBasket } from 'lucide-react';
import Link from "next/link"
import { colors } from "@/lib/colors"


const CartPage=()=>{
    return (
        <div className='flex flex-col justify-center items-center py-16'>
            <div className='text-center items-center flex flex-col gap-4 max-w-md'>
                <ShoppingBasket size={40} style={{ color: colors.text.accent }} />
                <i className='text-lg font-medium text-center' style={{ color: colors.text.primary }}>
                    Your cart is empty.
                </i>
                <p className="text-sm text-center" style={{ color: colors.text.secondary }}>
                    Orders are created directly from product cards right now. Browse products and place an order in one step.
                </p>
                <Link
                  href="/customer"
                  className="rounded-lg px-4 py-2 text-sm font-medium"
                  style={{ backgroundColor: colors.text.accent, color: colors.text.inverse }}
                >
                  Browse Products
                </Link>
            </div>
        </div>
    )
}

export default CartPage;
