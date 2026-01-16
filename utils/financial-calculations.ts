export interface FinancialInputs {
  principal: number;
  rate: number;
  time: number;
  compoundingFrequency?: 'monthly' | 'quarterly' | 'yearly';
}

export interface SIPInputs {
  monthlyInvestment: number;
  annualRate: number;
  years: number;
  stepUpPercentage?: number;
  lumpSumAmount?: number;
}

export interface LoanInputs {
  loanAmount: number;
  annualRate: number;
  tenureYears: number;
  prepaymentAmount?: number;
  prepaymentMonth?: number;
}

export interface AmortizationEntry {
  month: number;
  principal: number;
  interest: number;
  balance: number;
  emi: number;
}

export interface RetirementInputs {
  currentAge: number;
  retirementAge: number;
  currentSavings: number;
  monthlySavings: number;
  expectedReturn: number;
  inflationRate: number;
  monthlyExpenses: number;
}

export const COMPOUNDING_FREQUENCY_MAP = {
  monthly: 12,
  quarterly: 4,
  yearly: 1,
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('en-IN').format(Math.round(num));
};

export const calculateCompoundInterest = (
  principal: number,
  rate: number,
  time: number,
  compoundingFrequency: 'monthly' | 'quarterly' | 'yearly' = 'yearly'
): number => {
  const n = COMPOUNDING_FREQUENCY_MAP[compoundingFrequency];
  const r = rate / 100;
  const amount = principal * Math.pow(1 + r / n, n * time);
  return amount;
};

export const calculateSimpleInterest = (
  principal: number,
  rate: number,
  time: number
): number => {
  return principal * (1 + (rate * time) / 100);
};

export const calculateInflationAdjustedValue = (
  futureValue: number,
  inflationRate: number,
  years: number
): number => {
  const inflationFactor = Math.pow(1 + inflationRate / 100, years);
  return futureValue / inflationFactor;
};

export const calculateSIPFutureValue = (
  monthlyInvestment: number,
  annualRate: number,
  years: number,
  stepUpPercentage: number = 0
): { totalInvested: number; futureValue: number; totalReturns: number } => {
  const monthlyRate = annualRate / 100 / 12;
  const months = years * 12;
  let totalInvested = 0;
  let futureValue = 0;
  
  if (stepUpPercentage === 0) {
    totalInvested = monthlyInvestment * months;
    futureValue = monthlyInvestment * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate);
  } else {
    const yearlyStepUp = stepUpPercentage / 100;
    let currentMonthlyInvestment = monthlyInvestment;
    
    for (let year = 0; year < years; year++) {
      const monthsInYear = year === years - 1 ? months - (year * 12) : 12;
      totalInvested += currentMonthlyInvestment * monthsInYear;
      
      const monthsFromStart = year * 12;
      const remainingMonths = months - monthsFromStart;
      
      futureValue += currentMonthlyInvestment * ((Math.pow(1 + monthlyRate, remainingMonths) - 1) / monthlyRate) * (1 + monthlyRate);
      
      if (year < years - 1) {
        currentMonthlyInvestment *= (1 + yearlyStepUp);
      }
    }
  }
  
  const totalReturns = futureValue - totalInvested;
  
  return {
    totalInvested: Math.round(totalInvested),
    futureValue: Math.round(futureValue),
    totalReturns: Math.round(totalReturns),
  };
};

export const calculateLumpSumFutureValue = (
  lumpSumAmount: number,
  annualRate: number,
  years: number
): number => {
  return Math.round(lumpSumAmount * Math.pow(1 + annualRate / 100, years));
};

export const calculateEMI = (
  loanAmount: number,
  annualRate: number,
  tenureYears: number
): { emi: number; totalInterest: number; totalAmount: number } => {
  const monthlyRate = annualRate / 100 / 12;
  const months = tenureYears * 12;
  
  const emi = loanAmount * monthlyRate * Math.pow(1 + monthlyRate, months) / 
              (Math.pow(1 + monthlyRate, months) - 1);
  
  const totalAmount = emi * months;
  const totalInterest = totalAmount - loanAmount;
  
  return {
    emi: Math.round(emi),
    totalInterest: Math.round(totalInterest),
    totalAmount: Math.round(totalAmount),
  };
};

export const generateAmortizationSchedule = (
  loanAmount: number,
  annualRate: number,
  tenureYears: number,
  prepaymentAmount: number = 0,
  prepaymentMonth: number = 0
): AmortizationEntry[] => {
  const monthlyRate = annualRate / 100 / 12;
  const months = tenureYears * 12;
  const { emi } = calculateEMI(loanAmount, annualRate, tenureYears);
  
  let balance = loanAmount;
  const schedule: AmortizationEntry[] = [];
  
  for (let month = 1; month <= months; month++) {
    const interestPayment = balance * monthlyRate;
    const principalPayment = emi - interestPayment;
    
    if (month === prepaymentMonth && prepaymentAmount > 0) {
      balance -= prepaymentAmount;
    }
    
    balance -= principalPayment;
    
    schedule.push({
      month,
      principal: Math.round(principalPayment),
      interest: Math.round(interestPayment),
      balance: Math.max(0, Math.round(balance)),
      emi: Math.round(emi),
    });
    
    if (balance <= 0) break;
  }
  
  return schedule;
};

export const calculateRetirementCorpus = (
  inputs: RetirementInputs
): {
  retirementCorpus: number;
  inflationAdjustedCorpus: number;
  totalSavings: number;
  totalReturns: number;
  monthlyIncomeInRetirement: number;
} => {
  const yearsToRetirement = inputs.retirementAge - inputs.currentAge;
  const monthsToRetirement = yearsToRetirement * 12;
  const monthlyRate = inputs.expectedReturn / 100 / 12;
  
  const currentSavingsFutureValue = calculateCompoundInterest(
    inputs.currentSavings,
    inputs.expectedReturn,
    yearsToRetirement,
    'monthly'
  );
  
  const sipFutureValue = calculateSIPFutureValue(
    inputs.monthlySavings,
    inputs.expectedReturn,
    yearsToRetirement
  );
  
  const retirementCorpus = currentSavingsFutureValue + sipFutureValue.futureValue;
  const totalSavings = inputs.currentSavings + sipFutureValue.totalInvested;
  const totalReturns = retirementCorpus - totalSavings;
  
  const inflationAdjustedCorpus = calculateInflationAdjustedValue(
    retirementCorpus,
    inputs.inflationRate,
    yearsToRetirement
  );
  
  const safeWithdrawalRate = 0.04;
  const monthlyIncomeInRetirement = (retirementCorpus * safeWithdrawalRate) / 12;
  
  return {
    retirementCorpus: Math.round(retirementCorpus),
    inflationAdjustedCorpus: Math.round(inflationAdjustedCorpus),
    totalSavings: Math.round(totalSavings),
    totalReturns: Math.round(totalReturns),
    monthlyIncomeInRetirement: Math.round(monthlyIncomeInRetirement),
  };
};

export const calculateFDMaturity = (
  principal: number,
  annualRate: number,
  years: number,
  compoundingFrequency: 'monthly' | 'quarterly' | 'yearly' = 'quarterly'
): { maturityAmount: number; totalInterest: number } => {
  const maturityAmount = calculateCompoundInterest(principal, annualRate, years, compoundingFrequency);
  const totalInterest = maturityAmount - principal;
  
  return {
    maturityAmount: Math.round(maturityAmount),
    totalInterest: Math.round(totalInterest),
  };
};

export const calculateGoalBasedInvestment = (
  goalAmount: number,
  years: number,
  expectedReturn: number,
  currentSavings: number = 0
): {
  monthlySIPRequired: number;
  totalInvestment: number;
  futureValueOfCurrentSavings: number;
} => {
  const futureValueOfCurrentSavings = calculateCompoundInterest(
    currentSavings,
    expectedReturn,
    years,
    'monthly'
  );
  
  const remainingGoal = Math.max(0, goalAmount - futureValueOfCurrentSavings);
  const monthlyRate = expectedReturn / 100 / 12;
  const months = years * 12;
  
  let monthlySIPRequired = 0;
  if (remainingGoal > 0 && monthlyRate > 0) {
    monthlySIPRequired = remainingGoal / 
      (((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate));
  }
  
  const totalInvestment = currentSavings + (monthlySIPRequired * months);
  
  return {
    monthlySIPRequired: Math.round(monthlySIPRequired),
    totalInvestment: Math.round(totalInvestment),
    futureValueOfCurrentSavings: Math.round(futureValueOfCurrentSavings),
  };
};
