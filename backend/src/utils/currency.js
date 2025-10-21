// Currency utility functions for backend
const currencies = {
  USD: { symbol: '$', name: 'US Dollar', code: 'USD' },
  EUR: { symbol: '€', name: 'Euro', code: 'EUR' },
  GBP: { symbol: '£', name: 'British Pound', code: 'GBP' },
  INR: { symbol: '₹', name: 'Indian Rupee', code: 'INR' },
  JPY: { symbol: '¥', name: 'Japanese Yen', code: 'JPY' },
  CAD: { symbol: 'C$', name: 'Canadian Dollar', code: 'CAD' },
  AUD: { symbol: 'A$', name: 'Australian Dollar', code: 'AUD' },
  CHF: { symbol: 'CHF', name: 'Swiss Franc', code: 'CHF' },
  CNY: { symbol: '¥', name: 'Chinese Yuan', code: 'CNY' },
  BRL: { symbol: 'R$', name: 'Brazilian Real', code: 'BRL' },
  KRW: { symbol: '₩', name: 'South Korean Won', code: 'KRW' },
  MXN: { symbol: '$', name: 'Mexican Peso', code: 'MXN' },
  SGD: { symbol: 'S$', name: 'Singapore Dollar', code: 'SGD' },
  NZD: { symbol: 'NZ$', name: 'New Zealand Dollar', code: 'NZD' },
  NOK: { symbol: 'kr', name: 'Norwegian Krone', code: 'NOK' },
  SEK: { symbol: 'kr', name: 'Swedish Krona', code: 'SEK' },
  DKK: { symbol: 'kr', name: 'Danish Krone', code: 'DKK' },
  PLN: { symbol: 'zł', name: 'Polish Zloty', code: 'PLN' },
  RUB: { symbol: '₽', name: 'Russian Ruble', code: 'RUB' },
  ZAR: { symbol: 'R', name: 'South African Rand', code: 'ZAR' }
};

function formatAmount(amount, currencyCode = 'USD') {
  const currencyInfo = currencies[currencyCode] || currencies['USD'];
  const formattedAmount = new Intl.NumberFormat('en-US', {
    style: 'decimal',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
  
  return `${currencyInfo.symbol}${formattedAmount}`;
}

function getCurrencySymbol(currencyCode = 'USD') {
  return currencies[currencyCode]?.symbol || '$';
}

module.exports = {
  currencies,
  formatAmount,
  getCurrencySymbol
};