import { PortableText } from '@portabletext/react';
import AddToCartButton from './AddToCartButton';

interface ProductDetailProps {
  product: {
    id: number;
    name: string;
    price: string;
    stock: number;
    content: any; // PortableText
    image: string | null;
  };
}

export default function ProductDetail({ product }: ProductDetailProps) {
  const price = parseFloat(product.price);
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div>
        {product.image && (
          <img 
            src={product.image} 
            alt={product.name}
            className="w-full rounded-lg"
          />
        )}
      </div>
      <div>
        <h1 className="text-3xl font-bold">{product.name}</h1>
        <div className="my-4 text-xl font-semibold">
          {new Intl.NumberFormat('th-TH', {
            style: 'currency',
            currency: 'THB'
          }).format(price)}
        </div>
        <div className="my-4">
          {product.stock > 0 ? (
            <span className="text-green-600">มีสินค้า {product.stock} ชิ้น</span>
          ) : (
            <span className="text-red-600">สินค้าหมด</span>
          )}
        </div>
        
        <div className="prose my-6">
          <PortableText value={product.content} />
        </div>
        
        {product.stock > 0 && (
          <AddToCartButton productId={product.id} />
        )}
      </div>
    </div>
  );
}