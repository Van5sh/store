import Image from 'next/image';
import { Button } from '../ui/button';
import { Eye, ShoppingCart } from 'lucide-react';
import { colors } from '@/lib/colors';

interface ProductProps {
    name: string;
    price: number;
    type: string;
    img: string;
}

const ProductsCard: React.FC<ProductProps> = ({ name, price, type, img }) => {
    return (
        <div className="p-4 rounded-lg shadow-md transition-all duration-300" 
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
            }}>
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
    )
}

export default ProductsCard;