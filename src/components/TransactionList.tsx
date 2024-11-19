import React from 'react';
import { format } from 'date-fns';
import { Receipt, ChevronDown, ChevronUp } from 'lucide-react';
import { Sale } from '../types';

interface TransactionListProps {
  transactions: Sale[];
}

export default function TransactionList({ transactions }: TransactionListProps) {
  const [expandedSales, setExpandedSales] = React.useState<Set<number>>(new Set());

  const toggleSale = (saleId: number) => {
    const newExpanded = new Set(expandedSales);
    if (newExpanded.has(saleId)) {
      newExpanded.delete(saleId);
    } else {
      newExpanded.add(saleId);
    }
    setExpandedSales(newExpanded);
  };

  if (transactions.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 text-center">
        <Receipt className="mx-auto text-gray-400 mb-2" size={24} />
        <p className="text-gray-500">No transactions found</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {transactions.map((sale) => (
        <div key={sale.id} className="bg-white rounded-lg shadow-md overflow-hidden">
          <div
            className="p-4 cursor-pointer hover:bg-gray-50 flex items-center justify-between"
            onClick={() => toggleSale(sale.id)}
          >
            <div>
              <p className="font-semibold">
                Transaction #{sale.id}
              </p>
              <p className="text-sm text-gray-500">
                {format(new Date(sale.created_at), 'MMM d, yyyy h:mm a')}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <p className="font-semibold">${sale.total.toFixed(2)}</p>
              {expandedSales.has(sale.id) ? (
                <ChevronUp size={20} className="text-gray-500" />
              ) : (
                <ChevronDown size={20} className="text-gray-500" />
              )}
            </div>
          </div>
          
          {expandedSales.has(sale.id) && (
            <div className="border-t px-4 py-3 bg-gray-50">
              <table className="w-full">
                <thead>
                  <tr className="text-sm text-gray-600">
                    <th className="text-left py-2">Item</th>
                    <th className="text-right py-2">Qty</th>
                    <th className="text-right py-2">Price</th>
                    <th className="text-right py-2">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {sale.items.map((item) => (
                    <tr key={item.id} className="text-sm">
                      <td className="py-1">{item.product_name}</td>
                      <td className="text-right">{item.quantity}</td>
                      <td className="text-right">${item.price.toFixed(2)}</td>
                      <td className="text-right">
                        ${(item.quantity * item.price).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}