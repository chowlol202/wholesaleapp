import { useMemo } from 'react';

interface CalculatorProps {
  monthlyRent: number;
  monthlyPayment: number;
  downPayment: number;
  monthlyInsurance: number;
  monthlyPropertyTax: number;
  monthlyHOA: number;
  monthlyOther: number;
  capExPercentage: number;
  managementPercentage: number;
  vacancyPercentage: number;
}

export function useCalculator(props: CalculatorProps) {
  const {
    monthlyRent,
    monthlyPayment,
    downPayment,
    monthlyInsurance,
    monthlyPropertyTax,
    monthlyHOA,
    monthlyOther,
    capExPercentage,
    managementPercentage,
    vacancyPercentage,
  } = props;

  return useMemo(() => {
    // Calculate monthly expenses
    const monthlyCapEx = (monthlyRent * capExPercentage) / 100;
    const monthlyManagement = (monthlyRent * managementPercentage) / 100;
    const monthlyVacancy = (monthlyRent * vacancyPercentage) / 100;
    
    const monthlyOperatingExpenses = 
      monthlyPayment +
      monthlyInsurance +
      monthlyPropertyTax +
      monthlyHOA +
      monthlyOther +
      monthlyCapEx +
      monthlyManagement +
      monthlyVacancy;

    const monthlyCashFlow = monthlyRent - monthlyOperatingExpenses;
    const annualCashFlow = monthlyCashFlow * 12;

    // Calculate cash on cash return
    const totalInvestment = downPayment + (monthlyInsurance * 12);
    const cashOnCashReturn = totalInvestment > 0 
      ? (annualCashFlow / totalInvestment) * 100 
      : 0;

    return {
      monthly: {
        cashFlow: Math.round(monthlyCashFlow)
      },
      cashOnCashReturn: Number(cashOnCashReturn.toFixed(2))
    };
  }, [
    monthlyRent,
    monthlyPayment,
    downPayment,
    monthlyInsurance,
    monthlyPropertyTax,
    monthlyHOA,
    monthlyOther,
    capExPercentage,
    managementPercentage,
    vacancyPercentage,
  ]);
}