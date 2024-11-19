import React, { useEffect, useState } from 'react';
import { Store } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import ProductList from './components/ProductList';
import Cart from './components/Cart';
import DailySummary from './components/DailySummary';
import { useDatabase, getProducts, addSale, getDailySales } from './lib/db';
import { Product, DailySummary as DailySummaryType } from './types';

function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<Map<number, { product: Product; quantity: number }>>(
    new Map()
  );
  const [dailySummary, setDailySummary] = useState<DailySummaryType | null>(null);
  const isDBReady = useDatabase();

  useEffect(() => {
    if (isDBReady) {
      loadProducts();
      loadDailySummary();
    }
  }, [isDBReady]);

  const loadProducts = () => {
    try {
      const productList = getProducts();
      setProducts(productList);
    } catch (error) {
      toast.error('Failed to load products');
    }
  };

  const loadDailySummary = () => {
    try {
      const summary = getDailySales()[0] || { total_amount: 0, total_transactions: 0 };
      setDailySummary(summary);
    } catch (error) {
      toast.error('Failed to load daily summary');
    }
  };

  const handleAddToCart = (product: Product) => {
    const newCart = new Map(cart);
    const existing = newCart.get(product.id);

    if (existing) {
      if (existing.quantity >= product.stock) {
        toast.error('Not enough stock');
        return;
      }
      newCart.set(product.id, {
        product,
        quantity: existing.quantity + 1,
      });
    } else {
      newCart.set(product.id, { product, quantity: 1 });
    }

    setCart(newCart);
    toast.success(`Added ${product.name} to cart`);
  };

  const handleRemoveFromCart = (productId: number) => {
    const newCart = new Map(cart);
    const existing = newCart.get(productId);

    if (existing && existing.quantity > 1) {
      newCart.set(productId, {
        product: existing.product,
        quantity: existing.quantity - 1,
      });
    } else {
      newCart.delete(productId);
    }

    setCart(newCart);
  };

  const handleCheckout = () => {
    if (cart.size === 0) {
      toast.error('Cart is empty');
      return;
    }

    const total = Array.from(cart.values()).reduce(
      (sum, { product, quantity }) => sum + product.price * quantity,
      0
    );

    const items = Array.from(cart.values()).map(({ product, quantity }) => ({
      productId: product.id,
      quantity,
      price: product.price,
    }));

    try {
      addSale(total, items);
      setCart(new Map());
      loadProducts();
      loadDailySummary();
      toast.success('Sale completed successfully!');
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error('Failed to process sale');
    }
  };

  if (!isDBReady) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-gray-600">Initializing database...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center space-x-2">
            <Store className="text-blue-600" size={24} />
            <h1 className="text-xl font-semibold">Modern POS System</h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="mb-6">
          {dailySummary && (
            <DailySummary
              totalSales={dailySummary.total_amount}
              totalTransactions={dailySummary.total_transactions}
            />
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            <ProductList
              products={products}
              cart={cart}
              onAddToCart={handleAddToCart}
              onRemoveFromCart={handleRemoveFromCart}
            />
          </div>
          <div className="lg:col-span-1">
            <Cart
              cart={cart}
              onRemoveFromCart={handleRemoveFromCart}
              onCheckout={handleCheckout}
            />
          </div>
        </div>
      </main>
      <Toaster position="top-right" />
    </div>
  );
}

export default App;