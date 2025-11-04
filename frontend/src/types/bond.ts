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
  amortisation_flag: boolean;
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