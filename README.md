# Financial Calculators

A comprehensive suite of financial calculators built with Next.js, TypeScript, and Tailwind CSS. This application provides accurate calculations for investments, loans, and retirement planning with a modern, responsive interface.

## Features

- **5 Professional Calculators**: Mutual Fund SIP, Home Loan EMI, Fixed Deposit, Interest Calculator, and Retirement Planning
- **Advanced Financial Calculations**: Inflation-adjusted returns, step-up SIPs, variable rates, and compounding frequencies
- **Real-time Updates**: Interactive sliders and input fields with instant calculations
- **Dark & Light Mode**: Toggle between themes for comfortable viewing
- **Mobile Responsive**: Optimized for all devices
- **Professional UI**: Clean, modern interface with smooth animations
- **Chart Visualizations**: Interactive charts using Recharts
- **Production Ready**: Well-documented, modular, and extensible codebase

## Calculators Available

### 1. Mutual Fund SIP & Lump Sum Calculator
- Monthly SIP investments with step-up functionality
- One-time lump sum investments
- Expected returns with inflation adjustment
- Total invested vs total returns analysis

### 2. Home Loan / EMI Calculator
- EMI calculation with detailed amortization schedule
- Prepayment and part-payment options
- Total interest and loan burden analysis
- Inflation-adjusted loan cost

### 3. Fixed Deposit Calculator
- Multiple compounding frequencies (monthly, quarterly, yearly)
- Maturity amount and interest calculations
- Tax impact analysis
- Comparison with simple interest

### 4. Simple & Compound Interest Calculator
- Side-by-side comparison of simple vs compound interest
- Multiple compounding frequencies
- Effective annual rate calculations
- Real returns after inflation

### 5. Retirement & Goal-based Investment Calculator
- Retirement corpus planning with inflation adjustment
- Goal-based investment calculations
- Monthly SIP requirements for financial goals
- Financial independence analysis

## Installation

### Prerequisites
- Node.js 18.0 or later
- npm, yarn, or pnpm

### Clone and Install

```bash
# Clone the repository
git clone https://github.com/your-username/financial-calculators.git
cd financial-calculators

# Install dependencies
npm install
# or
yarn install
# or
pnpm install
```

### Development

```bash
# Start the development server
npm run dev
# or
yarn dev
# or
pnpm dev

# Open http://localhost:3000 in your browser
```

### Production Build

```bash
# Build for production
npm run build
# or
yarn build
# or
pnpm build

# Start production server
npm run start
# or
yarn start
# or
pnpm start
```

## Usage

### Basic Navigation
1. Open the application in your browser
2. Use the navigation bar to switch between calculators
3. Toggle dark/light mode using the theme switcher
4. Input your financial parameters using sliders or direct input
5. View real-time results and analysis

### Calculator Features

#### Input Controls
- **Sliders**: Interactive sliders for quick value adjustment
- **Number Inputs**: Precise value entry with validation
- **Dropdowns**: Select compounding frequencies and options
- **Real-time Updates**: Instant recalculation on any change

#### Results Display
- **Summary Cards**: Key metrics at a glance
- **Detailed Analysis**: Comprehensive breakdown of results
- **Comparisons**: Side-by-side comparisons where applicable
- **Visual Charts**: Interactive data visualization

#### Advanced Features
- **Inflation Adjustment**: See real purchasing power of future amounts
- **Tax Impact**: Understand after-tax implications
- **Amortization Schedules**: Detailed payment breakdowns
- **Goal Planning**: Calculate required investments for targets

## Financial Formulas Used

### SIP Future Value
```
FV = P × [((1 + r)^n - 1) / r] × (1 + r)
```
Where:
- FV = Future Value
- P = Monthly Investment
- r = Monthly Interest Rate
- n = Number of Months

### Compound Interest
```
A = P(1 + r/n)^(nt)
```
Where:
- A = Final Amount
- P = Principal
- r = Annual Interest Rate
- n = Compounding Frequency
- t = Time in Years

### EMI Calculation
```
EMI = P × r × (1 + r)^n / ((1 + r)^n - 1)
```
Where:
- EMI = Equated Monthly Installment
- P = Loan Amount
- r = Monthly Interest Rate
- n = Loan Tenure in Months

### Inflation Adjustment
```
Real Value = Future Value / (1 + inflation_rate)^years
```

## Project Structure

```
financial-calculators/
├── app/                          # Next.js app directory
│   ├── globals.css               # Global styles
│   ├── layout.tsx               # Root layout component
│   └── page.tsx                 # Main page component
├── components/                   # React components
│   ├── Navigation.tsx           # Main navigation
│   ├── MutualFundCalculator.tsx # SIP calculator
│   ├── HomeLoanCalculator.tsx   # EMI calculator
│   ├── FixedDepositCalculator.tsx # FD calculator
│   ├── InterestCalculator.tsx   # Interest calculator
│   ├── RetirementCalculator.tsx # Retirement calculator
│   └── FinancialChart.tsx      # Chart component
├── utils/                       # Utility functions
│   └── financial-calculations.ts # Financial calculation functions
├── public/                      # Static assets
├── package.json                 # Dependencies and scripts
├── tailwind.config.js           # Tailwind configuration
├── tsconfig.json               # TypeScript configuration
└── next.config.js              # Next.js configuration
```

## Key Dependencies

- **Next.js 14**: React framework with App Router
- **TypeScript**: Type safety and better development experience
- **Tailwind CSS**: Utility-first CSS framework
- **Recharts**: Chart library for data visualization
- **Lucide React**: Beautiful icon library

## Sample Test Values

### Mutual Fund Calculator
- Monthly SIP: ₹10,000
- Expected Return: 12%
- Investment Period: 10 years
- Step-up: 10% annually

### Home Loan Calculator
- Loan Amount: ₹50,00,000
- Interest Rate: 8.5%
- Tenure: 20 years

### Fixed Deposit Calculator
- Principal: ₹1,00,000
- Interest Rate: 6.5%
- Period: 5 years
- Compounding: Quarterly

### Retirement Calculator
- Current Age: 30
- Retirement Age: 60
- Current Savings: ₹5,00,000
- Monthly Savings: ₹15,000
- Expected Return: 12%
- Monthly Expenses: ₹50,000

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Development Guidelines

- Follow TypeScript best practices
- Use Tailwind CSS for styling
- Maintain responsive design principles
- Write clear, commented code
- Test thoroughly before submitting
- Follow conventional commit messages

## Performance Considerations

- Components use React hooks for optimal performance
- Calculations are memoized where appropriate
- Charts use responsive containers
- Images are optimized for web
- Build is optimized for production

## Security Notes

- No external API calls for calculations
- All calculations are client-side
- No sensitive data storage
- Safe input validation
- HTTPS recommended for production

## Disclaimer

This application is for informational purposes only. The calculations provided are estimates and should not be considered as financial advice. Please consult with qualified financial advisors before making any investment decisions.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, please open an issue on GitHub or contact the development team.

---

**Built with ❤️ using Next.js, TypeScript, and Tailwind CSS**
