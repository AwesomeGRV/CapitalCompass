'use client';

import React, { useState, useEffect } from 'react';
import { LoanInputs, calculateEMI, generateAmortizationSchedule, calculateInflationAdjustedValue, formatCurrency, AmortizationEntry } from '@/utils/financial-calculations';

export default function HomeLoanCalculator() {
  const [inputs, setInputs] = useState<LoanInputs>({
    loanAmount: 5000000,
    annualRate: 8.5,
    tenureYears: 20,
    prepaymentAmount: 0,
    prepaymentMonth: 0,
  });

  const [inflationRate, setInflationRate] = useState(6);
  const [emiResults, setEmiResults] = useState<{
    emi: number;
    totalInterest: number;
    totalAmount: number;
  } | null>(null);

  const [amortizationSchedule, setAmortizationSchedule] = useState<AmortizationEntry[]>([]);
  const [showSchedule, setShowSchedule] = useState(false);

  useEffect(() => {
    calculateResults();
  }, [inputs, inflationRate]);

  const calculateResults = () => {
    const results = calculateEMI(inputs.loanAmount, inputs.annualRate, inputs.tenureYears);
    setEmiResults(results);

    const schedule = generateAmortizationSchedule(
      inputs.loanAmount,
      inputs.annualRate,
      inputs.tenureYears,
      inputs.prepaymentAmount,
      inputs.prepaymentMonth
    );
    setAmortizationSchedule(schedule);
  };

  const handleInputChange = (field: keyof LoanInputs, value: string) => {
    const numValue = parseFloat(value) || 0;
    setInputs(prev => ({ ...prev, [field]: numValue }));
  };

  const inflationAdjustedTotalCost = emiResults 
    ? calculateInflationAdjustedValue(emiResults.totalAmount, inflationRate, inputs.tenureYears)
    : 0;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Home Loan / EMI Calculator
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Loan Amount (₹)
            </label>
            <input
              type="number"
              value={inputs.loanAmount}
              onChange={(e) => handleInputChange('loanAmount', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              min="0"
              step="100000"
            />
            <input
              type="range"
              value={inputs.loanAmount}
              onChange={(e) => handleInputChange('loanAmount', e.target.value)}
              className="w-full mt-2"
              min="100000"
              max="50000000"
              step="100000"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Annual Interest Rate (%)
            </label>
            <input
              type="number"
              value={inputs.annualRate}
              onChange={(e) => handleInputChange('annualRate', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              min="0"
              max="20"
              step="0.1"
            />
            <input
              type="range"
              value={inputs.annualRate}
              onChange={(e) => handleInputChange('annualRate', e.target.value)}
              className="w-full mt-2 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-blue-600"
              min="5"
              max="15"
              step="0.1"
              style={{
                background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${((inputs.annualRate - 5) / (15 - 5)) * 100}%, #e5e7eb ${((inputs.annualRate - 5) / (15 - 5)) * 100}%, #e5e7eb 100%)`
              }}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Loan Tenure (Years)
            </label>
            <input
              type="number"
              value={inputs.tenureYears}
              onChange={(e) => handleInputChange('tenureYears', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              min="1"
              max="30"
              step="1"
            />
            <input
              type="range"
              value={inputs.tenureYears}
              onChange={(e) => handleInputChange('tenureYears', e.target.value)}
              className="w-full mt-2 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-blue-600"
              min="5"
              max="30"
              step="1"
              style={{
                background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${((inputs.tenureYears - 5) / (30 - 5)) * 100}%, #e5e7eb ${((inputs.tenureYears - 5) / (30 - 5)) * 100}%, #e5e7eb 100%)`
              }}
            />
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Prepayment Amount (₹)
            </label>
            <input
              type="number"
              value={inputs.prepaymentAmount}
              onChange={(e) => handleInputChange('prepaymentAmount', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              min="0"
              step="50000"
            />
            <input
              type="range"
              value={inputs.prepaymentAmount}
              onChange={(e) => handleInputChange('prepaymentAmount', e.target.value)}
              className="w-full mt-2 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-blue-600"
              min="0"
              max="5000000"
              step="50000"
              style={{
                background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${((inputs.prepaymentAmount || 0) / 5000000) * 100}%, #e5e7eb ${((inputs.prepaymentAmount || 0) / 5000000) * 100}%, #e5e7eb 100%)`
              }}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Prepayment Month
            </label>
            <input
              type="number"
              value={inputs.prepaymentMonth}
              onChange={(e) => handleInputChange('prepaymentMonth', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              min="0"
              max={inputs.tenureYears * 12}
              step="1"
            />
            <input
              type="range"
              value={inputs.prepaymentMonth}
              onChange={(e) => handleInputChange('prepaymentMonth', e.target.value)}
              className="w-full mt-2 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-blue-600"
              min="0"
              max={inputs.tenureYears * 12}
              step="6"
              style={{
                background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${((inputs.prepaymentMonth || 0) / (inputs.tenureYears * 12)) * 100}%, #e5e7eb ${((inputs.prepaymentMonth || 0) / (inputs.tenureYears * 12)) * 100}%, #e5e7eb 100%)`
              }}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Inflation Rate (%)
            </label>
            <input
              type="number"
              value={inflationRate}
              onChange={(e) => setInflationRate(parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              min="0"
              max="20"
              step="0.1"
            />
            <input
              type="range"
              value={inflationRate}
              onChange={(e) => setInflationRate(parseFloat(e.target.value) || 0)}
              className="w-full mt-2 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-blue-600"
              min="0"
              max="15"
              step="0.1"
              style={{
                background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${(inflationRate / 15) * 100}%, #e5e7eb ${(inflationRate / 15) * 100}%, #e5e7eb 100%)`
              }}
            />
          </div>
        </div>
      </div>

      {emiResults && (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">Monthly EMI</p>
            <p className="text-2xl font-bold text-blue-900 dark:text-blue-300">
              {formatCurrency(emiResults.emi)}
            </p>
          </div>
          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
            <p className="text-sm text-green-600 dark:text-green-400 font-medium">Total Interest</p>
            <p className="text-2xl font-bold text-green-900 dark:text-green-300">
              {formatCurrency(emiResults.totalInterest)}
            </p>
            <p className="text-xs text-green-600 dark:text-green-400 mt-1">
              ({((emiResults.totalInterest / inputs.loanAmount) * 100).toFixed(1)}% of loan)
            </p>
          </div>
          <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
            <p className="text-sm text-purple-600 dark:text-purple-400 font-medium">Total Amount</p>
            <p className="text-2xl font-bold text-purple-900 dark:text-purple-300">
              {formatCurrency(emiResults.totalAmount)}
            </p>
          </div>
          <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg">
            <p className="text-sm text-orange-600 dark:text-orange-400 font-medium">Inflation Adjusted</p>
            <p className="text-2xl font-bold text-orange-900 dark:text-orange-300">
              {formatCurrency(inflationAdjustedTotalCost)}
            </p>
            <p className="text-xs text-orange-600 dark:text-orange-400 mt-1">
              Today's purchasing power
            </p>
          </div>
        </div>
      )}

      <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Loan Summary
        </h3>
        {emiResults && (
          <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
            <p>
              <strong>Loan Amount:</strong> {formatCurrency(inputs.loanAmount)}
            </p>
            <p>
              <strong>Interest Rate:</strong> {inputs.annualRate}% per annum
            </p>
            <p>
              <strong>Tenure:</strong> {inputs.tenureYears} years ({inputs.tenureYears * 12} months)
            </p>
            <p>
              <strong>Monthly EMI:</strong> {formatCurrency(emiResults.emi)}
            </p>
            {inputs.prepaymentAmount && inputs.prepaymentAmount > 0 && inputs.prepaymentMonth && inputs.prepaymentMonth > 0 && (
              <p>
                <strong>Prepayment:</strong> {formatCurrency(inputs.prepaymentAmount)} in month {inputs.prepaymentMonth}
              </p>
            )}
            <p>
              <strong>Total Interest Payable:</strong> {formatCurrency(emiResults.totalInterest)}
            </p>
            <p>
              <strong>Total Payment:</strong> {formatCurrency(emiResults.totalAmount)}
            </p>
          </div>
        )}
      </div>

      <div className="mt-6">
        <button
          onClick={() => setShowSchedule(!showSchedule)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          {showSchedule ? 'Hide' : 'Show'} Amortization Schedule
        </button>
      </div>

      {showSchedule && amortizationSchedule.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Amortization Schedule
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Month
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    EMI
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Principal
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Interest
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Balance
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {amortizationSchedule.slice(0, 12).map((entry) => (
                  <tr key={entry.month}>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {entry.month}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {formatCurrency(entry.emi)}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {formatCurrency(entry.principal)}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {formatCurrency(entry.interest)}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {formatCurrency(entry.balance)}
                    </td>
                  </tr>
                ))}
                {amortizationSchedule.length > 12 && (
                  <tr>
                    <td colSpan={5} className="px-4 py-2 text-center text-sm text-gray-500 dark:text-gray-400">
                      ... and {amortizationSchedule.length - 12} more months
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
