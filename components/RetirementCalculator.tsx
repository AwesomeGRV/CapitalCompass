'use client';

import React, { useState, useEffect } from 'react';
import { RetirementInputs, calculateRetirementCorpus, calculateGoalBasedInvestment, formatCurrency } from '@/utils/financial-calculations';

export default function RetirementCalculator() {
  const [mode, setMode] = useState<'retirement' | 'goal'>('retirement');
  
  const [retirementInputs, setRetirementInputs] = useState<RetirementInputs>({
    currentAge: 30,
    retirementAge: 60,
    currentSavings: 500000,
    monthlySavings: 15000,
    expectedReturn: 12,
    inflationRate: 6,
    monthlyExpenses: 50000,
  });

  const [goalInputs, setGoalInputs] = useState({
    goalAmount: 10000000,
    years: 10,
    expectedReturn: 12,
    currentSavings: 1000000,
  });

  const [retirementResults, setRetirementResults] = useState<{
    retirementCorpus: number;
    inflationAdjustedCorpus: number;
    totalSavings: number;
    totalReturns: number;
    monthlyIncomeInRetirement: number;
  } | null>(null);

  const [goalResults, setGoalResults] = useState<{
    monthlySIPRequired: number;
    totalInvestment: number;
    futureValueOfCurrentSavings: number;
  } | null>(null);

  useEffect(() => {
    if (mode === 'retirement') {
      calculateRetirementResults();
    } else {
      calculateGoalResults();
    }
  }, [mode, retirementInputs, goalInputs]);

  const calculateRetirementResults = () => {
    const results = calculateRetirementCorpus(retirementInputs);
    setRetirementResults(results);
  };

  const calculateGoalResults = () => {
    const results = calculateGoalBasedInvestment(
      goalInputs.goalAmount,
      goalInputs.years,
      goalInputs.expectedReturn,
      goalInputs.currentSavings
    );
    setGoalResults(results);
  };

  const handleRetirementInputChange = (field: keyof RetirementInputs, value: string) => {
    const numValue = parseFloat(value) || 0;
    setRetirementInputs(prev => ({ ...prev, [field]: numValue }));
  };

  const handleGoalInputChange = (field: keyof typeof goalInputs, value: string) => {
    const numValue = parseFloat(value) || 0;
    setGoalInputs(prev => ({ ...prev, [field]: numValue }));
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Retirement & Goal-based Investment Calculator
      </h2>

      <div className="mb-6">
        <div className="flex space-x-4">
          <button
            onClick={() => setMode('retirement')}
            className={`px-4 py-2 rounded-md font-medium transition-colors ${
              mode === 'retirement'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            Retirement Planning
          </button>
          <button
            onClick={() => setMode('goal')}
            className={`px-4 py-2 rounded-md font-medium transition-colors ${
              mode === 'goal'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            Goal-based Investment
          </button>
        </div>
      </div>

      {mode === 'retirement' ? (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Current Age
                </label>
                <input
                  type="number"
                  value={retirementInputs.currentAge}
                  onChange={(e) => handleRetirementInputChange('currentAge', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  min="18"
                  max="80"
                  step="1"
                />
                <input
                  type="range"
                  value={retirementInputs.currentAge}
                  onChange={(e) => handleRetirementInputChange('currentAge', e.target.value)}
                  className="w-full mt-2"
                  min="18"
                  max="60"
                  step="1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Retirement Age
                </label>
                <input
                  type="number"
                  value={retirementInputs.retirementAge}
                  onChange={(e) => handleRetirementInputChange('retirementAge', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  min="40"
                  max="100"
                  step="1"
                />
                <input
                  type="range"
                  value={retirementInputs.retirementAge}
                  onChange={(e) => handleRetirementInputChange('retirementAge', e.target.value)}
                  className="w-full mt-2"
                  min="40"
                  max="70"
                  step="1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Current Savings (₹)
                </label>
                <input
                  type="number"
                  value={retirementInputs.currentSavings}
                  onChange={(e) => handleRetirementInputChange('currentSavings', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  min="0"
                  step="50000"
                />
                <input
                  type="range"
                  value={retirementInputs.currentSavings}
                  onChange={(e) => handleRetirementInputChange('currentSavings', e.target.value)}
                  className="w-full mt-2"
                  min="0"
                  max="5000000"
                  step="50000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Monthly Savings (₹)
                </label>
                <input
                  type="number"
                  value={retirementInputs.monthlySavings}
                  onChange={(e) => handleRetirementInputChange('monthlySavings', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  min="0"
                  step="1000"
                />
                <input
                  type="range"
                  value={retirementInputs.monthlySavings}
                  onChange={(e) => handleRetirementInputChange('monthlySavings', e.target.value)}
                  className="w-full mt-2"
                  min="1000"
                  max="100000"
                  step="1000"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Expected Annual Return (%)
                </label>
                <input
                  type="number"
                  value={retirementInputs.expectedReturn}
                  onChange={(e) => handleRetirementInputChange('expectedReturn', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  min="0"
                  max="20"
                  step="0.1"
                />
                <input
                  type="range"
                  value={retirementInputs.expectedReturn}
                  onChange={(e) => handleRetirementInputChange('expectedReturn', e.target.value)}
                  className="w-full mt-2"
                  min="5"
                  max="15"
                  step="0.1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Inflation Rate (%)
                </label>
                <input
                  type="number"
                  value={retirementInputs.inflationRate}
                  onChange={(e) => handleRetirementInputChange('inflationRate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  min="0"
                  max="15"
                  step="0.1"
                />
                <input
                  type="range"
                  value={retirementInputs.inflationRate}
                  onChange={(e) => handleRetirementInputChange('inflationRate', e.target.value)}
                  className="w-full mt-2"
                  min="2"
                  max="10"
                  step="0.1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Monthly Expenses at Retirement (₹)
                </label>
                <input
                  type="number"
                  value={retirementInputs.monthlyExpenses}
                  onChange={(e) => handleRetirementInputChange('monthlyExpenses', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  min="0"
                  step="5000"
                />
                <input
                  type="range"
                  value={retirementInputs.monthlyExpenses}
                  onChange={(e) => handleRetirementInputChange('monthlyExpenses', e.target.value)}
                  className="w-full mt-2"
                  min="10000"
                  max="200000"
                  step="5000"
                />
              </div>
            </div>
          </div>

          {retirementResults && (
            <div className="mt-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                  <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">Retirement Corpus</p>
                  <p className="text-2xl font-bold text-blue-900 dark:text-blue-300">
                    {formatCurrency(retirementResults.retirementCorpus)}
                  </p>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                  <p className="text-sm text-green-600 dark:text-green-400 font-medium">Inflation Adjusted</p>
                  <p className="text-2xl font-bold text-green-900 dark:text-green-300">
                    {formatCurrency(retirementResults.inflationAdjustedCorpus)}
                  </p>
                </div>
                <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                  <p className="text-sm text-purple-600 dark:text-purple-400 font-medium">Total Returns</p>
                  <p className="text-2xl font-bold text-purple-900 dark:text-purple-300">
                    {formatCurrency(retirementResults.totalReturns)}
                  </p>
                  <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">
                    ({((retirementResults.totalReturns / retirementResults.totalSavings) * 100).toFixed(1)}% returns)
                  </p>
                </div>
                <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg">
                  <p className="text-sm text-orange-600 dark:text-orange-400 font-medium">Monthly Income</p>
                  <p className="text-2xl font-bold text-orange-900 dark:text-orange-300">
                    {formatCurrency(retirementResults.monthlyIncomeInRetirement)}
                  </p>
                  <p className="text-xs text-orange-600 dark:text-orange-400 mt-1">
                    4% withdrawal rate
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">
                    Retirement Summary
                  </h4>
                  <div className="space-y-1 text-xs text-gray-600 dark:text-gray-300">
                    <p><strong>Years to Retirement:</strong> {retirementInputs.retirementAge - retirementInputs.currentAge} years</p>
                    <p><strong>Total Investment:</strong> {formatCurrency(retirementResults.totalSavings)}</p>
                    <p><strong>Expected Corpus:</strong> {formatCurrency(retirementResults.retirementCorpus)}</p>
                    <p><strong>Monthly Expenses:</strong> {formatCurrency(retirementInputs.monthlyExpenses)}</p>
                    <p><strong>Retirement Income:</strong> {formatCurrency(retirementResults.monthlyIncomeInRetirement)}</p>
                    <p><strong>Income Coverage:</strong> {(retirementResults.monthlyIncomeInRetirement / retirementInputs.monthlyExpenses).toFixed(1)}x expenses</p>
                  </div>
                </div>

                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <h4 className="text-sm font-semibold text-blue-800 dark:text-blue-200 mb-2">
                    Financial Independence Analysis
                  </h4>
                  <div className="space-y-1 text-xs text-blue-700 dark:text-blue-300">
                    <p><strong>Required Corpus:</strong> {formatCurrency(retirementInputs.monthlyExpenses * 12 * 25)}</p>
                    <p><strong>Achieved Corpus:</strong> {formatCurrency(retirementResults.retirementCorpus)}</p>
                    <p><strong>Surplus/Shortfall:</strong> {formatCurrency(retirementResults.retirementCorpus - (retirementInputs.monthlyExpenses * 12 * 25))}</p>
                    <p><strong>Real Returns:</strong> {(((retirementResults.inflationAdjustedCorpus - retirementResults.totalSavings) / retirementResults.totalSavings) * 100).toFixed(1)}%</p>
                    <p><strong>Retirement Duration:</strong> {Math.floor(retirementResults.retirementCorpus / (retirementInputs.monthlyExpenses * 12))} years</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Goal Amount (₹)
                </label>
                <input
                  type="number"
                  value={goalInputs.goalAmount}
                  onChange={(e) => handleGoalInputChange('goalAmount', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  min="0"
                  step="100000"
                />
                <input
                  type="range"
                  value={goalInputs.goalAmount}
                  onChange={(e) => handleGoalInputChange('goalAmount', e.target.value)}
                  className="w-full mt-2"
                  min="100000"
                  max="50000000"
                  step="100000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Time Period (Years)
                </label>
                <input
                  type="number"
                  value={goalInputs.years}
                  onChange={(e) => handleGoalInputChange('years', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  min="1"
                  max="30"
                  step="1"
                />
                <input
                  type="range"
                  value={goalInputs.years}
                  onChange={(e) => handleGoalInputChange('years', e.target.value)}
                  className="w-full mt-2"
                  min="1"
                  max="25"
                  step="1"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Expected Annual Return (%)
                </label>
                <input
                  type="number"
                  value={goalInputs.expectedReturn}
                  onChange={(e) => handleGoalInputChange('expectedReturn', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  min="0"
                  max="20"
                  step="0.1"
                />
                <input
                  type="range"
                  value={goalInputs.expectedReturn}
                  onChange={(e) => handleGoalInputChange('expectedReturn', e.target.value)}
                  className="w-full mt-2"
                  min="5"
                  max="15"
                  step="0.1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Current Savings (₹)
                </label>
                <input
                  type="number"
                  value={goalInputs.currentSavings}
                  onChange={(e) => handleGoalInputChange('currentSavings', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  min="0"
                  step="50000"
                />
                <input
                  type="range"
                  value={goalInputs.currentSavings}
                  onChange={(e) => handleGoalInputChange('currentSavings', e.target.value)}
                  className="w-full mt-2"
                  min="0"
                  max="10000000"
                  step="50000"
                />
              </div>
            </div>
          </div>

          {goalResults && (
            <div className="mt-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                  <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">Monthly SIP Required</p>
                  <p className="text-2xl font-bold text-blue-900 dark:text-blue-300">
                    {formatCurrency(goalResults.monthlySIPRequired)}
                  </p>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                  <p className="text-sm text-green-600 dark:text-green-400 font-medium">Total Investment</p>
                  <p className="text-2xl font-bold text-green-900 dark:text-green-300">
                    {formatCurrency(goalResults.totalInvestment)}
                  </p>
                </div>
                <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                  <p className="text-sm text-purple-600 dark:text-purple-400 font-medium">Current Savings Future Value</p>
                  <p className="text-2xl font-bold text-purple-900 dark:text-purple-300">
                    {formatCurrency(goalResults.futureValueOfCurrentSavings)}
                  </p>
                </div>
              </div>

              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">
                  Goal Analysis
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-gray-600 dark:text-gray-300">
                  <div className="space-y-1">
                    <p><strong>Goal Amount:</strong> {formatCurrency(goalInputs.goalAmount)}</p>
                    <p><strong>Time Period:</strong> {goalInputs.years} years</p>
                    <p><strong>Expected Return:</strong> {goalInputs.expectedReturn}% per annum</p>
                    <p><strong>Current Savings:</strong> {formatCurrency(goalInputs.currentSavings)}</p>
                  </div>
                  <div className="space-y-1">
                    <p><strong>Future Value of Current Savings:</strong> {formatCurrency(goalResults.futureValueOfCurrentSavings)}</p>
                    <p><strong>Additional Amount Needed:</strong> {formatCurrency(Math.max(0, goalInputs.goalAmount - goalResults.futureValueOfCurrentSavings))}</p>
                    <p><strong>Monthly SIP Required:</strong> {formatCurrency(goalResults.monthlySIPRequired)}</p>
                    <p><strong>Total Investment Needed:</strong> {formatCurrency(goalResults.totalInvestment)}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
