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
  processingFee?: number;
  insuranceAmount?: number;
  loanType?: 'home' | 'personal' | 'car' | 'education';
  taxSection?: '24b' | '80c' | 'none';
  variableRates?: { year: number; rate: number }[];
}

export interface AmortizationEntry {
  month: number;
  principal: number;
  interest: number;
  balance: number;
  emi: number;
  inflationAdjustedEmi?: number;
  realInterest?: number;
  taxBenefit?: number;
  cumulativeInterest?: number;
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
  tenureYears: number,
  processingFee: number = 0,
  insuranceAmount: number = 0
): { emi: number; totalInterest: number; totalAmount: number; effectiveLoanAmount: number } => {
  const monthlyRate = annualRate / 100 / 12;
  const months = tenureYears * 12;
  const effectiveLoanAmount = loanAmount + processingFee + insuranceAmount;
  
  if (monthlyRate === 0) {
    const emi = effectiveLoanAmount / months;
    return {
      emi: Math.round(emi),
      totalInterest: 0,
      totalAmount: Math.round(effectiveLoanAmount),
      effectiveLoanAmount: Math.round(effectiveLoanAmount)
    };
  }
  
  const emi = effectiveLoanAmount * monthlyRate * Math.pow(1 + monthlyRate, months) / 
              (Math.pow(1 + monthlyRate, months) - 1);
  
  const totalAmount = emi * months;
  const totalInterest = totalAmount - effectiveLoanAmount;
  
  return {
    emi: Math.round(emi),
    totalInterest: Math.round(totalInterest),
    totalAmount: Math.round(totalAmount),
    effectiveLoanAmount: Math.round(effectiveLoanAmount)
  };
};

export const generateAmortizationSchedule = (
  loanAmount: number,
  annualRate: number,
  tenureYears: number,
  prepaymentAmount: number = 0,
  prepaymentMonth: number = 0,
  processingFee: number = 0,
  insuranceAmount: number = 0,
  inflationRate: number = 0,
  loanType: 'home' | 'personal' | 'car' | 'education' = 'home',
  taxSection: '24b' | '80c' | 'none' = 'none',
  variableRates: { year: number; rate: number }[] = []
): AmortizationEntry[] => {
  const months = tenureYears * 12;
  const { emi, effectiveLoanAmount } = calculateEMI(loanAmount, annualRate, tenureYears, processingFee, insuranceAmount);
  
  let balance = effectiveLoanAmount;
  const schedule: AmortizationEntry[] = [];
  let cumulativeInterest = 0;
  
  for (let month = 1; month <= months; month++) {
    const currentYear = Math.floor((month - 1) / 12);
    let currentAnnualRate = annualRate;
    
    // Apply variable rates if specified
    const variableRate = variableRates.find(vr => vr.year === currentYear);
    if (variableRate) {
      currentAnnualRate = variableRate.rate;
    }
    
    const monthlyRate = currentAnnualRate / 100 / 12;
    const interestPayment = balance * monthlyRate;
    let principalPayment = emi - interestPayment;
    
    // Apply prepayment
    if (month === prepaymentMonth && prepaymentAmount > 0) {
      balance -= prepaymentAmount;
      // Recalculate EMI for remaining balance if significant prepayment
      if (prepaymentAmount > balance * 0.1) {
        const remainingMonths = months - month;
        if (remainingMonths > 0 && monthlyRate > 0) {
          const newEmi = balance * monthlyRate * Math.pow(1 + monthlyRate, remainingMonths) / 
                       (Math.pow(1 + monthlyRate, remainingMonths) - 1);
          principalPayment = newEmi - interestPayment;
        }
      }
    }
    
    balance -= principalPayment;
    cumulativeInterest += interestPayment;
    
    // Calculate inflation-adjusted EMI
    const inflationAdjustedEmi = inflationRate > 0 
      ? emi / Math.pow(1 + inflationRate / 100 / 12, month - 1)
      : emi;
    
    // Calculate real interest (adjusted for inflation)
    const realInterestRate = (1 + monthlyRate) / (1 + inflationRate / 100 / 12) - 1;
    const realInterest = balance > 0 ? balance * realInterestRate : 0;
    
    // Calculate tax benefits
    let taxBenefit = 0;
    if (taxSection === '24b' && loanType === 'home') {
      // Section 24(b): Home loan interest deduction (max ₹2,00,000 per year)
      const yearlyInterest = interestPayment * 12;
      taxBenefit = Math.min(yearlyInterest, 200000) / 12;
    } else if (taxSection === '80c' && loanType === 'home') {
      // Section 80(c): Principal repayment deduction (max ₹1,50,000 per year)
      taxBenefit = Math.min(principalPayment * 12, 150000) / 12;
    }
    
    schedule.push({
      month,
      principal: Math.round(principalPayment),
      interest: Math.round(interestPayment),
      balance: Math.max(0, Math.round(balance)),
      emi: Math.round(emi),
      inflationAdjustedEmi: Math.round(inflationAdjustedEmi),
      realInterest: Math.round(realInterest),
      taxBenefit: Math.round(taxBenefit),
      cumulativeInterest: Math.round(cumulativeInterest)
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

export const calculateAdvancedLoanMetrics = (
  schedule: AmortizationEntry[],
  inflationRate: number = 0,
  loanType: 'home' | 'personal' | 'car' | 'education' = 'home'
): {
  totalTaxBenefits: number;
  effectiveInterestRate: number;
  realCostOfLoan: number;
  inflationAdjustedTotalCost: number;
  averageMonthlyEmi: number;
  interestToPrincipalRatio: number;
} => {
  const totalTaxBenefits = schedule.reduce((sum, entry) => sum + (entry.taxBenefit || 0), 0);
  const totalInterest = schedule.reduce((sum, entry) => sum + entry.interest, 0);
  const totalPrincipal = schedule.reduce((sum, entry) => sum + entry.principal, 0);
  const totalEmi = schedule.reduce((sum, entry) => sum + entry.emi, 0);
  
  const effectiveInterestRate = totalPrincipal > 0 ? (totalInterest / totalPrincipal) * 100 : 0;
  const realCostOfLoan = totalInterest - totalTaxBenefits;
  const inflationAdjustedTotalCost = inflationRate > 0 
    ? totalEmi / Math.pow(1 + inflationRate / 100, schedule.length / 12)
    : totalEmi;
  const averageMonthlyEmi = schedule.length > 0 ? totalEmi / schedule.length : 0;
  const interestToPrincipalRatio = totalPrincipal > 0 ? totalInterest / totalPrincipal : 0;
  
  return {
    totalTaxBenefits: Math.round(totalTaxBenefits),
    effectiveInterestRate: Math.round(effectiveInterestRate * 100) / 100,
    realCostOfLoan: Math.round(realCostOfLoan),
    inflationAdjustedTotalCost: Math.round(inflationAdjustedTotalCost),
    averageMonthlyEmi: Math.round(averageMonthlyEmi),
    interestToPrincipalRatio: Math.round(interestToPrincipalRatio * 100) / 100,
  };
};

export const calculateLoanAffordability = (
  monthlyIncome: number,
  existingEmis: number = 0,
  interestRate: number = 8.5,
  tenureYears: number = 20,
  maxDTIRatio: number = 0.4
): {
  maxLoanAmount: number;
  maxEmi: number;
  recommendedEmi: number;
  recommendedLoanAmount: number;
} => {
  const maxEmi = monthlyIncome * maxDTIRatio - existingEmis;
  const recommendedEmi = monthlyIncome * 0.3 - existingEmis; // Conservative 30% ratio
  
  const monthlyRate = interestRate / 100 / 12;
  const months = tenureYears * 12;
  
  const calculateLoanFromEmi = (emiAmount: number) => {
    if (monthlyRate === 0) return emiAmount * months;
    return emiAmount * (Math.pow(1 + monthlyRate, months) - 1) / 
           (monthlyRate * Math.pow(1 + monthlyRate, months));
  };
  
  return {
    maxLoanAmount: Math.round(calculateLoanFromEmi(Math.max(0, maxEmi))),
    maxEmi: Math.round(Math.max(0, maxEmi)),
    recommendedEmi: Math.round(Math.max(0, recommendedEmi)),
    recommendedLoanAmount: Math.round(calculateLoanFromEmi(Math.max(0, recommendedEmi))),
  };
};
