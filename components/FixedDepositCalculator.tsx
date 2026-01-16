'use client';

import React, { useState, useEffect } from 'react';
import { calculateFDMaturity, calculateInflationAdjustedValue, formatCurrency } from '@/utils/financial-calculations';

interface FDInputs {
  principal: number;
  annualRate: number;
  years: number;
  compoundingFrequency: 'monthly' | 'quarterly' | 'yearly';
}

export default function FixedDepositCalculator() {
  const [inputs, setInputs] = useState<FDInputs>({
    principal: 100000,
    annualRate: 6.5,
    years: 5,
    compoundingFrequency: 'quarterly',
  });

  const [inflationRate, setInflationRate] = useState(6);
  const [results, setResults] = useState<{
    maturityAmount: number;
    totalInterest: number;
    inflationAdjustedValue: number;
  } | null>(null);

  useEffect(() => {
    calculateResults();
  }, [inputs, inflationRate]);

  const calculateResults = () => {
    const fdResults = calculateFDMaturity(
      inputs.principal,
      inputs.annualRate,
      inputs.years,
      inputs.compoundingFrequency
    );

    const inflationAdjustedValue = calculateInflationAdjustedValue(
      fdResults.maturityAmount,
      inflationRate,
      inputs.years
    );

    setResults({
      ...fdResults,
      inflationAdjustedValue,
    });
  };

  const handleInputChange = (field: keyof FDInputs, value: string) => {
    if (field === 'compoundingFrequency') {
      setInputs(prev => ({ ...prev, [field]: value as 'monthly' | 'quarterly' | 'yearly' }));
    } else {
      const numValue = parseFloat(value) || 0;
      setInputs(prev => ({ ...prev, [field]: numValue }));
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Fixed Deposit Calculator
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Principal Amount (₹)
            </label>
            <input
              type="number"
              value={inputs.principal}
              onChange={(e) => handleInputChange('principal', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              min="0"
              step="10000"
            />
            <input
              type="range"
              value={inputs.principal}
              onChange={(e) => handleInputChange('principal', e.target.value)}
              className="w-full mt-2"
              min="1000"
              max="10000000"
              step="10000"
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
              max="15"
              step="0.1"
            />
            <input
              type="range"
              value={inputs.annualRate}
              onChange={(e) => handleInputChange('annualRate', e.target.value)}
              className="w-full mt-2"
              min="3"
              max="10"
              step="0.1"
            />
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Investment Period (Years)
            </label>
            <input
              type="number"
              value={inputs.years}
              onChange={(e) => handleInputChange('years', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              min="0.5"
              max="20"
              step="0.5"
            />
            <input
              type="range"
              value={inputs.years}
              onChange={(e) => handleInputChange('years', e.target.value)}
              className="w-full mt-2"
              min="1"
              max="10"
              step="0.5"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Compounding Frequency
            </label>
            <select
              value={inputs.compoundingFrequency}
              onChange={(e) => handleInputChange('compoundingFrequency', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
              <option value="yearly">Yearly</option>
            </select>
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
              className="w-full mt-2"
              min="0"
              max="15"
              step="0.1"
            />
          </div>
        </div>
      </div>

      {results && (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">Principal Amount</p>
            <p className="text-2xl font-bold text-blue-900 dark:text-blue-300">
              {formatCurrency(inputs.principal)}
            </p>
          </div>
          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
            <p className="text-sm text-green-600 dark:text-green-400 font-medium">Maturity Amount</p>
            <p className="text-2xl font-bold text-green-900 dark:text-green-300">
              {formatCurrency(results.maturityAmount)}
            </p>
          </div>
          <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
            <p className="text-sm text-purple-600 dark:text-purple-400 font-medium">Total Interest</p>
            <p className="text-2xl font-bold text-purple-900 dark:text-purple-300">
              {formatCurrency(results.totalInterest)}
            </p>
            <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">
              ({((results.totalInterest / inputs.principal) * 100).toFixed(1)}% returns)
            </p>
          </div>
          <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg">
            <p className="text-sm text-orange-600 dark:text-orange-400 font-medium">Inflation Adjusted</p>
            <p className="text-2xl font-bold text-orange-900 dark:text-orange-300">
              {formatCurrency(results.inflationAdjustedValue)}
            </p>
            <p className="text-xs text-orange-600 dark:text-orange-400 mt-1">
              Today's purchasing power
            </p>
          </div>
        </div>
      )}

      <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Investment Summary
        </h3>
        {results && (
          <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
            <p>
              <strong>Principal Amount:</strong> {formatCurrency(inputs.principal)}
            </p>
            <p>
              <strong>Interest Rate:</strong> {inputs.annualRate}% per annum
            </p>
            <p>
              <strong>Compounding:</strong> {inputs.compoundingFrequency}
            </p>
            <p>
              <strong>Investment Period:</strong> {inputs.years} years
            </p>
            <p>
              <strong>Maturity Amount:</strong> {formatCurrency(results.maturityAmount)}
            </p>
            <p>
              <strong>Total Interest Earned:</strong> {formatCurrency(results.totalInterest)}
            </p>
            <p>
              <strong>Effective Annual Yield:</strong> {((Math.pow(results.maturityAmount / inputs.principal, 1 / inputs.years) - 1) * 100).toFixed(2)}%
            </p>
            <p>
              <strong>Inflation Adjusted Value:</strong> {formatCurrency(results.inflationAdjustedValue)}
            </p>
            <p>
              <strong>Real Returns:</strong> {((results.inflationAdjustedValue - inputs.principal) / inputs.principal * 100).toFixed(1)}%
            </p>
          </div>
        )}
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <h4 className="text-sm font-semibold text-blue-800 dark:text-blue-200 mb-2">
            Tax Implications (Approximate)
          </h4>
          <div className="space-y-1 text-xs text-blue-700 dark:text-blue-300">
            <p><strong>Interest Income:</strong> {formatCurrency(results?.totalInterest || 0)}</p>
            <p><strong>Tax @ 30% (if applicable):</strong> {formatCurrency((results?.totalInterest || 0) * 0.3)}</p>
            <p><strong>Post-tax Interest:</strong> {formatCurrency((results?.totalInterest || 0) * 0.7)}</p>
            <p><strong>Post-tax Maturity:</strong> {formatCurrency(inputs.principal + ((results?.totalInterest || 0) * 0.7))}</p>
          </div>
        </div>

        <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
          <h4 className="text-sm font-semibold text-green-800 dark:text-green-200 mb-2">
            Comparison with Simple Interest
          </h4>
          <div className="space-y-1 text-xs text-green-700 dark:text-green-300">
            <p><strong>Simple Interest:</strong> {formatCurrency(inputs.principal * inputs.annualRate * inputs.years / 100)}</p>
            <p><strong>Compound Interest:</strong> {formatCurrency(results?.totalInterest || 0)}</p>
            <p><strong>Extra Earnings:</strong> {formatCurrency((results?.totalInterest || 0) - (inputs.principal * inputs.annualRate * inputs.years / 100))}</p>
            <p><strong>Advantage:</strong> {(((results?.totalInterest || 0) - (inputs.principal * inputs.annualRate * inputs.years / 100)) / (inputs.principal * inputs.annualRate * inputs.years / 100) * 100).toFixed(1)}% more</p>
          </div>
        </div>
      </div>
    </div>
  );
}
