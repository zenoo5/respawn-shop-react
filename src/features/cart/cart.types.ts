// Describe the compact cart entries, derived totals, and supported cart actions.

export interface CartItem {
  id: string;
  quantity: number;
}

export interface CartTotals {
  count: number;
  totalCents: number;
}

export type CartAction = "add" | "increase" | "decrease" | "remove" | "clear";
