export interface Bond {
  bond_id: number;
  name: string;
  isin: string;
  ticker: string;
  nominal: number;
  coupon_quantity_per_year: number;
  sector: string;
  placement_date: string;
  perpertual_flag: boolean;
  maturity_date: string;
}

export interface BondsResponse {
  content: Bond[];
  total_pages: number;
  total_elements: number;
  size: number;
  number: number;
}