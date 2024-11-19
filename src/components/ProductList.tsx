import React from 'react';
import { Plus, Minus } from 'lucide-react';
import { Product } from '../types';

interface ProductListProps {
  products: Product[];
  cart: Map<number, { product: Product; quantity: number }>;
  onAddToCart: (product: Product) => void;
  onRemoveFromCart: (productId: number) => void;
}

export default function ProductList({ products, cart, onAddToCart, onRemoveFromCart }: ProductListProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
      {products.map((product) => {
        const cartItem = cart.get(product.id);
        const quantity = cartItem?.quantity || 0;

        return (
          <div
            key={product.id}
            className="bg-white rounded-lg shadow-md p-4 flex flex-col justify-between"
          >
            <div>
              <h3 className="text-lg font-semibold">{product.name}</h3>
              <p className="text-gray-600">${product.price.toFixed(2)}</p>
              <p className="text-sm text-gray-500">Stock: {product.stock}</p>
            </div>
            <div className="flex items-center justify-between mt-4">
              {quantity > 0 ? (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => onRemoveFromCart(product.id)}
                    className="p-1 rounded-full bg-red-100 text-red-600 hover:bg-red-200"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="font-medium">{quantity}</span>
                  <button
                    onClick={() => onAddToCart(product)}
                    className="p-1 rounded-full bg-green-100 text-green-600 hover:bg-green-200"
                    disabled={product.stock <= quantity}
                  >
                    <Plus size={16} />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => onAddToCart(product)}
                  className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  disabled={product.stock <= 0}
                >
                  Add to Cart
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}