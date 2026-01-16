import { ShoppingBasket } from 'lucide-react';


const CartPage=()=>{
    return (
        <div className='flex flex-col justify-center items-center'>
            <div className='text-center items-center flex flex-col gap-4 mt-20'>
                <ShoppingBasket size={40}/>
                <i className='text-lg font-medium text-center'>
                    NO ITEMS IN THE CART AVAILABLE
                </i>
            </div>
        </div>
    )
}

export default CartPage;