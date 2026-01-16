'use client';

import React, { useState, useEffect } from 'react';
import { calculateSimpleInterest, calculateCompoundInterest, calculateInflationAdjustedValue, formatCurrency, FinancialInputs } from '@/utils/financial-calculations';

export default function InterestCalculator() {
  const [inputs, setInputs] = useState<FinancialInputs>({
    principal: 100000,
    rate: 8,
    time: 5,
    compoundingFrequency: 'yearly',
  });

  const [inflationRate, setInflationRate] = useState(6);
  const [results, setResults] = useState<{
    simpleInterest: number;
    simpleAmount: number;
    compoundInterest: number;
    compoundAmount: number;
    difference: number;
    inflationAdjustedSimple: number;
    inflationAdjustedCompound: number;
  } | null>(null);

  useEffect(() => {
    calculateResults();
  }, [inputs, inflationRate]);

  const calculateResults = () => {
    const simpleAmount = calculateSimpleInterest(inputs.principal, inputs.rate, inputs.time);
    const simpleInterest = simpleAmount - inputs.principal;
    
    const compoundAmount = calculateCompoundInterest(
      inputs.principal,
      inputs.rate,
      inputs.time,
      inputs.compoundingFrequency
    );
    const compoundInterest = compoundAmount - inputs.principal;
    
    const difference = compoundAmount - simpleAmount;
    
    const inflationAdjustedSimple = calculateInflationAdjustedValue(
      simpleAmount,
      inflationRate,
      inputs.time
    );
    
    const inflationAdjustedCompound = calculateInflationAdjustedValue(
      compoundAmount,
      inflationRate,
      inputs.time
    );

    setResults({
      simpleInterest,
      simpleAmount,
      compoundInterest,
      compoundAmount,
      difference,
      inflationAdjustedSimple,
      inflationAdjustedCompound,
    });
  };

  const handleInputChange = (field: keyof FinancialInputs, value: string) => {
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
        Simple & Compound Interest Calculator
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
              value={inputs.rate}
              onChange={(e) => handleInputChange('rate', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              min="0"
              max="30"
              step="0.1"
            />
            <input
              type="range"
              value={inputs.rate}
              onChange={(e) => handleInputChange('rate', e.target.value)}
              className="w-full mt-2"
              min="1"
              max="25"
              step="0.1"
            />
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Time Period (Years)
            </label>
            <input
              type="number"
              value={inputs.time}
              onChange={(e) => handleInputChange('time', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              min="0.5"
              max="30"
              step="0.5"
            />
            <input
              type="range"
              value={inputs.time}
              onChange={(e) => handleInputChange('time', e.target.value)}
              className="w-full mt-2"
              min="1"
              max="25"
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
        <div className="mt-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-4">
                Simple Interest
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-blue-600 dark:text-blue-400">Principal:</span>
                  <span className="font-medium text-blue-900 dark:text-blue-300">
                    {formatCurrency(inputs.principal)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-blue-600 dark:text-blue-400">Interest Earned:</span>
                  <span className="font-medium text-blue-900 dark:text-blue-300">
                    {formatCurrency(results.simpleInterest)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-blue-600 dark:text-blue-400">Total Amount:</span>
                  <span className="font-bold text-blue-900 dark:text-blue-300">
                    {formatCurrency(results.simpleAmount)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-blue-600 dark:text-blue-400">Inflation Adjusted:</span>
                  <span className="font-medium text-blue-900 dark:text-blue-300">
                    {formatCurrency(results.inflationAdjustedSimple)}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-green-800 dark:text-green-200 mb-4">
                Compound Interest ({inputs.compoundingFrequency})
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-green-600 dark:text-green-400">Principal:</span>
                  <span className="font-medium text-green-900 dark:text-green-300">
                    {formatCurrency(inputs.principal)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-green-600 dark:text-green-400">Interest Earned:</span>
                  <span className="font-medium text-green-900 dark:text-green-300">
                    {formatCurrency(results.compoundInterest)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-green-600 dark:text-green-400">Total Amount:</span>
                  <span className="font-bold text-green-900 dark:text-green-300">
                    {formatCurrency(results.compoundAmount)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-green-600 dark:text-green-400">Inflation Adjusted:</span>
                  <span className="font-medium text-green-900 dark:text-green-300">
                    {formatCurrency(results.inflationAdjustedCompound)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-purple-800 dark:text-purple-200 mb-4">
              Comparison & Analysis
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-sm text-purple-600 dark:text-purple-400 mb-1">Extra Earnings</p>
                <p className="text-xl font-bold text-purple-900 dark:text-purple-300">
                  {formatCurrency(results.difference)}
                </p>
                <p className="text-xs text-purple-600 dark:text-purple-400">
                  Compound vs Simple
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-purple-600 dark:text-purple-400 mb-1">Simple Returns</p>
                <p className="text-xl font-bold text-purple-900 dark:text-purple-300">
                  {((results.simpleInterest / inputs.principal) * 100).toFixed(1)}%
                </p>
                <p className="text-xs text-purple-600 dark:text-purple-400">
                  Total returns
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-purple-600 dark:text-purple-400 mb-1">Compound Returns</p>
                <p className="text-xl font-bold text-purple-900 dark:text-purple-300">
                  {((results.compoundInterest / inputs.principal) * 100).toFixed(1)}%
                </p>
                <p className="text-xs text-purple-600 dark:text-purple-400">
                  Total returns
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
              <h4 className="text-sm font-semibold text-orange-800 dark:text-orange-200 mb-2">
                Effective Annual Rate
              </h4>
              <div className="space-y-1 text-xs text-orange-700 dark:text-orange-300">
                <p><strong>Simple Interest:</strong> {inputs.rate}% per annum</p>
                <p><strong>Compound Interest:</strong> {((Math.pow(results.compoundAmount / inputs.principal, 1 / inputs.time) - 1) * 100).toFixed(2)}% per annum</p>
                <p><strong>Advantage:</strong> {(((Math.pow(results.compoundAmount / inputs.principal, 1 / inputs.time) - 1) * 100) - inputs.rate).toFixed(2)}% higher</p>
              </div>
            </div>

            <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <h4 className="text-sm font-semibold text-red-800 dark:text-red-200 mb-2">
                Real Returns (Inflation Adjusted)
              </h4>
              <div className="space-y-1 text-xs text-red-700 dark:text-red-300">
                <p><strong>Simple Real Returns:</strong> {(((results.inflationAdjustedSimple - inputs.principal) / inputs.principal) * 100).toFixed(1)}%</p>
                <p><strong>Compound Real Returns:</strong> {(((results.inflationAdjustedCompound - inputs.principal) / inputs.principal) * 100).toFixed(1)}%</p>
                <p><strong>Purchasing Power Gain:</strong> {formatCurrency(results.inflationAdjustedCompound - inputs.principal)}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Interest Calculation Formulas
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-300">
          <div>
            <p className="font-medium mb-1">Simple Interest:</p>
            <p className="font-mono text-xs">A = P(1 + rt)</p>
            <p className="text-xs mt-1">Where: A = Amount, P = Principal, r = Rate, t = Time</p>
          </div>
          <div>
            <p className="font-medium mb-1">Compound Interest:</p>
            <p className="font-mono text-xs">A = P(1 + r/n)^(nt)</p>
            <p className="text-xs mt-1">Where: n = Compounding frequency per year</p>
          </div>
        </div>
      </div>
    </div>
  );
}
