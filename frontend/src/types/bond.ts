export interface Bond {
  bond_id: number;
  figi: string;
  bond_type: string;
  country_of_risk_name: string;
  currency: string;
  name: string;
  isin: string;
  buy_available_flag: boolean;
  sell_available_flag: boolean;
  amortization_flag: boolean;
  ticker: string;
  nominal: number;
  coupon_quantity_per_year: number;
  sector: string;
  placement_date: string;
  perpetual_flag: boolean;
  maturity_date: string;
  last_price: number;
  Coupons?: Coupon[];
}

export interface Coupon {
  coupon_id: number;
  bond_figi: string;
  coupon_number: number;
  coupon_date: string;
  pay_one_bond: number;
  coupon_type: string;
  coupon_start?: string;
  coupon_end?: string;
  coupon_period?: number;
}

export interface BondsResponse {
  content: Bond[];
  total_pages: number;
  total_elements: number;
  size: number;
  number: number;
}