import { useMemo } from 'react';

interface LoanCalculatorProps {
  purchasePrice: number;
  downPayment: number;
  interestRate: number;
  amortization: number;
}

interface LoanCalculations {
  loanAmount: number;
  monthlyPayment: number;
  annualPayment: number;
}

export function useLoanCalculator({
  purchasePrice,
  downPayment,
  interestRate,
  amortization
}: LoanCalculatorProps): LoanCalculations {
  return useMemo(() => {
    const loanAmount = purchasePrice - downPayment;
    
    let monthlyPayment = 0;
    let annualPayment = 0;

    if (interestRate > 0) {
      const monthlyInterest = interestRate / 100 / 12;
      const numberOfPayments = amortization * 12;
      
      monthlyPayment = loanAmount * (
        (monthlyInterest * Math.pow(1 + monthlyInterest, numberOfPayments)) /
        (Math.pow(1 + monthlyInterest, numberOfPayments) - 1)
      );
    } else {
      monthlyPayment = loanAmount / (amortization * 12);
    }
    
    annualPayment = monthlyPayment * 12;

    return {
      loanAmount,
      monthlyPayment: Number(monthlyPayment.toFixed(2)),
      annualPayment: Number(annualPayment.toFixed(2))
    };
  }, [purchasePrice, downPayment, interestRate, amortization]);
}