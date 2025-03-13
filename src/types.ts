export type OfferStatus = 'pending' | 'accepted' | 'denied' | null;

export interface Property {
  id: string;
  address: string;
  realtorName: string;
  realtorNumber: string;
  askingPrice: number;
  purchasePrice: number;
  interest: number;
  monthlyPayment: number;
  downPayment: number;
  cashFlow: number;
  cashOnCashReturn: number;
  rent: number;
  contacted: boolean;
  notes: string;
  imageUrl: string;
  offerStatus: OfferStatus;
  createdAt: string;
  monthlyInsurance: number;
  monthlyPropertyTax: number;
  monthlyHOA: number;
  monthlyOther: number;
  capExPercentage: number;
  managementPercentage: number;
  vacancyPercentage: number;
}