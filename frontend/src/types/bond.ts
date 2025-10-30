export interface Bond {
  id: number;
  name: string;
  issuer: string;
  face_value: number;
  coupon_rate: number;
  coupon_value: number;
  issue_date: string;
  maturity_date: string;
}

export interface BondsResponse {
  content: Bond[];
  total_pages: number;
  total_elements: number;
  size: number;
  number: number;
}