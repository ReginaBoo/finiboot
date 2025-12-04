export interface Portfolio {
  id: number;
  name: string;
}

export interface PortfolioItem {
  isin: string;
  quantity: number;
  purchase_date: string;
  sell_date: string;
  name: string;
  nominal: number;
  currency: string;
}

export interface PortfolioTransactions {
  id: number;
  bond_isin: string;
  quantity: number;
  price: number;
  purchase_date: string;
  sell_date: string;
  created_at: string;
}
