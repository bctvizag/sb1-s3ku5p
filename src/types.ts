export interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  created_at: string;
}

export interface Sale {
  id: number;
  total: number;
  created_at: string;
}

export interface DailySummary {
  date: string;
  total_transactions: number;
  total_amount: number;
}