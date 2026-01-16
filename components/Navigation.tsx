'use client';

import React, { useState, useEffect } from 'react';
import { Moon, Sun, Calculator, TrendingUp, Home, PiggyBank, Target, Heart } from 'lucide-react';

interface NavigationProps {
  activeCalculator: string;
  onCalculatorChange: (calculator: string) => void;
}

export default function Navigation({ activeCalculator, onCalculatorChange }: NavigationProps) {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = savedTheme || (prefersDark ? 'dark' : 'light');
    setIsDarkMode(theme === 'dark');
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, []);

  const toggleDarkMode = () => {
    const newTheme = isDarkMode ? 'light' : 'dark';
    setIsDarkMode(!isDarkMode);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  const calculators = [
    { id: 'mutual-fund', name: 'Mutual Fund SIP', icon: TrendingUp },
    { id: 'home-loan', name: 'Home Loan EMI', icon: Home },
    { id: 'fixed-deposit', name: 'Fixed Deposit', icon: PiggyBank },
    { id: 'interest', name: 'Interest Calculator', icon: Calculator },
    { id: 'retirement', name: 'Retirement & Goals', icon: Target },
  ];

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="flex items-center space-x-2">
              <Calculator className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                Financial Calculators
              </h1>
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-1">
            {calculators.map((calc) => {
              const Icon = calc.icon;
              return (
                <button
                  key={calc.id}
                  onClick={() => onCalculatorChange(calc.id)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeCalculator === calc.id
                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-800'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{calc.name}</span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        <div className="md:hidden border-t border-gray-200 dark:border-gray-700">
          <div className="py-2 space-y-1">
            {calculators.map((calc) => {
              const Icon = calc.icon;
              return (
                <button
                  key={calc.id}
                  onClick={() => onCalculatorChange(calc.id)}
                  className={`flex items-center space-x-3 w-full px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeCalculator === calc.id
                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-800'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{calc.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
