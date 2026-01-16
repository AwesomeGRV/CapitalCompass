'use client';

import React, { useState } from 'react';
import Navigation from '@/components/Navigation';
import MutualFundCalculator from '@/components/MutualFundCalculator';
import HomeLoanCalculator from '@/components/HomeLoanCalculator';
import FixedDepositCalculator from '@/components/FixedDepositCalculator';
import InterestCalculator from '@/components/InterestCalculator';
import RetirementCalculator from '@/components/RetirementCalculator';

export default function Home() {
  const [activeCalculator, setActiveCalculator] = useState('mutual-fund');

  const renderCalculator = () => {
    switch (activeCalculator) {
      case 'mutual-fund':
        return <MutualFundCalculator />;
      case 'home-loan':
        return <HomeLoanCalculator />;
      case 'fixed-deposit':
        return <FixedDepositCalculator />;
      case 'interest':
        return <InterestCalculator />;
      case 'retirement':
        return <RetirementCalculator />;
      default:
        return <MutualFundCalculator />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation 
        activeCalculator={activeCalculator} 
        onCalculatorChange={setActiveCalculator} 
      />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-fade-in">
          {renderCalculator()}
        </div>
      </main>

      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                About Financial Calculators
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                A comprehensive suite of financial calculators designed to help you make informed investment and borrowing decisions. 
                Plan your financial future with accurate calculations and real-time insights.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Features
              </h3>
              <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-2">
                <li>• Real-time calculations</li>
                <li>• Inflation-adjusted returns</li>
                <li>• Multiple compounding frequencies</li>
                <li>• Dark & light mode</li>
                <li>• Mobile responsive design</li>
                <li>• Professional UI/UX</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Calculators Available
              </h3>
              <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-2">
                <li>• Mutual Fund SIP & Lump Sum</li>
                <li>• Home Loan EMI Calculator</li>
                <li>• Fixed Deposit Calculator</li>
                <li>• Simple & Compound Interest</li>
                <li>• Retirement & Goal Planning</li>
              </ul>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
            <p className="text-center text-sm text-gray-500 dark:text-gray-400">
              © 2024 Financial Calculators. Built with Next.js, TypeScript, and Tailwind CSS.
            </p>
            <p className="text-center text-xs text-gray-400 dark:text-gray-500 mt-2">
              Disclaimer: These calculators are for informational purposes only. Please consult with financial advisors for personalized advice.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
