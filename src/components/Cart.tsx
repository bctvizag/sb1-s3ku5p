import React, { useState } from 'react';
import { Trash2, Printer } from 'lucide-react';
import { Product } from '../types';
import { ReceiptPrinter } from '../lib/printer';
import toast from 'react-hot-toast';

interface CartProps {
  cart: Map<number, { product: Product; quantity: number }>;
  onRemoveFromCart: (productId: number) => void;
  onCheckout: () => void;
}

export default function Cart({ cart, onRemoveFromCart, onCheckout }: CartProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const cartItems = Array.from(cart.values());
  const total = cartItems.reduce(
    (sum, { product, quantity }) => sum + product.price * quantity,
    0
  );

  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      return;
    }

    setIsProcessing(true);

    try {
      // Create sale data for printing
      const saleData = {
        items: cartItems.map(({ product, quantity }) => ({
          id: 0, // Temporary ID as it's not saved yet
          sale_id: 0,
          product_id: product.id,
          product_name: product.name,
          quantity,
          price: product.price
        })),
        total
      };

      // Try to print receipt
      const printer = new ReceiptPrinter();
      await printer.printReceipt(saleData);

      // Complete checkout
      onCheckout();
    } catch (error: any) {
      // If it's not a printer error, show a generic error
      if (!error.message?.includes('printer')) {
        toast.error('Failed to process checkout');
      }
      // Continue with checkout even if printing fails
      onCheckout();
    } finally {
      setIsProcessing(false);
    }
  };

  if (cart.size === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <p className="text-gray-500 text-center">Cart is empty</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Shopping Cart</h2>
      <div className="space-y-4">
        {cartItems.map(({ product, quantity }) => (
          <div key={product.id} className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">{product.name}</h3>
              <p className="text-sm text-gray-500">
                ${product.price.toFixed(2)} x {quantity}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <p className="font-medium">
                ${(product.price * quantity).toFixed(2)}
              </p>
              <button
                onClick={() => onRemoveFromCart(product.id)}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
        <div className="border-t pt-4 mt-4">
          <div className="flex justify-between items-center mb-4">
            <span className="font-semibold">Total:</span>
            <span className="font-semibold">${total.toFixed(2)}</span>
          </div>
          <button
            onClick={handleCheckout}
            disabled={cartItems.length === 0 || isProcessing}
            className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <Printer size={18} />
            {isProcessing ? 'Processing...' : 'Print & Checkout'}
          </button>
        </div>
      </div>
    </div>
  );
}