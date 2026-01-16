'use client';

import React, { useState, useEffect } from 'react';
import { SIPInputs, calculateSIPFutureValue, calculateLumpSumFutureValue, calculateInflationAdjustedValue, formatCurrency } from '@/utils/financial-calculations';

interface SIPResults {
  totalInvested: number;
  futureValue: number;
  totalReturns: number;
  inflationAdjustedValue?: number;
}

export default function MutualFundCalculator() {
  const [inputs, setInputs] = useState<SIPInputs>({
    monthlyInvestment: 10000,
    annualRate: 12,
    years: 10,
    stepUpPercentage: 0,
    lumpSumAmount: 0,
  });

  const [inflationRate, setInflationRate] = useState(6);
  const [results, setResults] = useState<SIPResults | null>(null);

  useEffect(() => {
    calculateResults();
  }, [inputs, inflationRate]);

  const calculateResults = () => {
    const sipResults = calculateSIPFutureValue(
      inputs.monthlyInvestment,
      inputs.annualRate,
      inputs.years,
      inputs.stepUpPercentage
    );

    let lumpSumFutureValue = 0;
    if (inputs.lumpSumAmount && inputs.lumpSumAmount > 0) {
      lumpSumFutureValue = calculateLumpSumFutureValue(
        inputs.lumpSumAmount,
        inputs.annualRate,
        inputs.years
      );
    }

    const totalInvested = sipResults.totalInvested + (inputs.lumpSumAmount || 0);
    const totalFutureValue = sipResults.futureValue + lumpSumFutureValue;
    const totalReturns = totalFutureValue - totalInvested;
    const inflationAdjustedValue = calculateInflationAdjustedValue(
      totalFutureValue,
      inflationRate,
      inputs.years
    );

    setResults({
      totalInvested,
      futureValue: totalFutureValue,
      totalReturns,
      inflationAdjustedValue,
    });
  };

  const handleInputChange = (field: keyof SIPInputs, value: string) => {
    const numValue = parseFloat(value) || 0;
    setInputs(prev => ({ ...prev, [field]: numValue }));
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Mutual Fund SIP & Lump Sum Calculator
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Monthly SIP Investment (₹)
            </label>
            <input
              type="number"
              value={inputs.monthlyInvestment}
              onChange={(e) => handleInputChange('monthlyInvestment', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              min="0"
              step="500"
            />
            <input
              type="range"
              value={inputs.monthlyInvestment}
              onChange={(e) => handleInputChange('monthlyInvestment', e.target.value)}
              className="w-full mt-2 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-blue-600"
              min="500"
              max="100000"
              step="500"
              style={{
                background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${((inputs.monthlyInvestment - 500) / (100000 - 500)) * 100}%, #e5e7eb ${((inputs.monthlyInvestment - 500) / (100000 - 500)) * 100}%, #e5e7eb 100%)`
              }}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Lump Sum Investment (₹)
            </label>
            <input
              type="number"
              value={inputs.lumpSumAmount}
              onChange={(e) => handleInputChange('lumpSumAmount', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              min="0"
              step="1000"
            />
            <input
              type="range"
              value={inputs.lumpSumAmount}
              onChange={(e) => handleInputChange('lumpSumAmount', e.target.value)}
              className="w-full mt-2 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-blue-600"
              min="0"
              max="1000000"
              step="1000"
              style={{
                background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${((inputs.lumpSumAmount || 0) / 1000000) * 100}%, #e5e7eb ${((inputs.lumpSumAmount || 0) / 1000000) * 100}%, #e5e7eb 100%)`
              }}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Expected Annual Return (%)
            </label>
            <input
              type="number"
              value={inputs.annualRate}
              onChange={(e) => handleInputChange('annualRate', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              min="0"
              max="30"
              step="0.1"
            />
            <input
              type="range"
              value={inputs.annualRate}
              onChange={(e) => handleInputChange('annualRate', e.target.value)}
              className="w-full mt-2 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-blue-600"
              min="1"
              max="30"
              step="0.1"
              style={{
                background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${((inputs.annualRate - 1) / (30 - 1)) * 100}%, #e5e7eb ${((inputs.annualRate - 1) / (30 - 1)) * 100}%, #e5e7eb 100%)`
              }}
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
              min="1"
              max="40"
              step="1"
            />
            <input
              type="range"
              value={inputs.years}
              onChange={(e) => handleInputChange('years', e.target.value)}
              className="w-full mt-2 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-blue-600"
              min="1"
              max="40"
              step="1"
              style={{
                background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${((inputs.years - 1) / (40 - 1)) * 100}%, #e5e7eb ${((inputs.years - 1) / (40 - 1)) * 100}%, #e5e7eb 100%)`
              }}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Annual Step-up Percentage (%)
            </label>
            <input
              type="number"
              value={inputs.stepUpPercentage}
              onChange={(e) => handleInputChange('stepUpPercentage', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              min="0"
              max="20"
              step="1"
            />
            <input
              type="range"
              value={inputs.stepUpPercentage}
              onChange={(e) => handleInputChange('stepUpPercentage', e.target.value)}
              className="w-full mt-2 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-blue-600"
              min="0"
              max="20"
              step="1"
              style={{
                background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${((inputs.stepUpPercentage || 0) / 20) * 100}%, #e5e7eb ${((inputs.stepUpPercentage || 0) / 20) * 100}%, #e5e7eb 100%)`
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
              max="20"
              step="0.1"
              style={{
                background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${(inflationRate / 20) * 100}%, #e5e7eb ${(inflationRate / 20) * 100}%, #e5e7eb 100%)`
              }}
            />
          </div>
        </div>
      </div>

      {results && (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">Total Invested</p>
            <p className="text-2xl font-bold text-blue-900 dark:text-blue-300">
              {formatCurrency(results.totalInvested)}
            </p>
          </div>
          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
            <p className="text-sm text-green-600 dark:text-green-400 font-medium">Future Value</p>
            <p className="text-2xl font-bold text-green-900 dark:text-green-300">
              {formatCurrency(results.futureValue)}
            </p>
          </div>
          <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
            <p className="text-sm text-purple-600 dark:text-purple-400 font-medium">Total Returns</p>
            <p className="text-2xl font-bold text-purple-900 dark:text-purple-300">
              {formatCurrency(results.totalReturns)}
            </p>
            <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">
              ({((results.totalReturns / results.totalInvested) * 100).toFixed(1)}% returns)
            </p>
          </div>
          <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg">
            <p className="text-sm text-orange-600 dark:text-orange-400 font-medium">Inflation Adjusted</p>
            <p className="text-2xl font-bold text-orange-900 dark:text-orange-300">
              {formatCurrency(results.inflationAdjustedValue || 0)}
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
              <strong>Monthly SIP:</strong> {formatCurrency(inputs.monthlyInvestment)} for {inputs.years} years
            </p>
            {(inputs.lumpSumAmount || 0) > 0 && (
              <p>
                <strong>Lump Sum:</strong> {formatCurrency(inputs.lumpSumAmount || 0)} one-time investment
              </p>
            )}
            <p>
              <strong>Expected Return:</strong> {inputs.annualRate}% per annum
            </p>
            {(inputs.stepUpPercentage || 0) > 0 && (
              <p>
                <strong>Step-up:</strong> {inputs.stepUpPercentage}% annual increase in SIP
              </p>
            )}
            <p>
              <strong>Wealth Created:</strong> {formatCurrency(results.totalReturns)} 
              ({((results.totalReturns / results.totalInvested) * 100).toFixed(1)}% of investment)
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
