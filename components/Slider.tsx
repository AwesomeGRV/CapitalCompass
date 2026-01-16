'use client';

import React from 'react';

interface SliderProps {
  value: number;
  onChange: (value: string) => void;
  min: number;
  max: number;
  step: number;
  className?: string;
}

export default function Slider({ value, onChange, min, max, step, className = '' }: SliderProps) {
  const percentage = ((value - min) / (max - min)) * 100;
  
  return (
    <input
      type="range"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`w-full mt-2 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-blue-600 ${className}`}
      min={min}
      max={max}
      step={step}
      style={{
        background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${percentage}%, #e5e7eb ${percentage}%, #e5e7eb 100%)`
      }}
    />
  );
}
