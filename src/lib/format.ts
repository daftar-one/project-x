// Exchange rates expressed as "how many INR = 1 unit of this currency"
export const EXCHANGE_RATES_TO_INR: Record<string, number> = {
  INR: 1,
  USD: 84.15,
  EUR: 90.87,
  GBP: 107.22,
  JPY: 0.56,
  AED: 22.91,
  SGD: 63.28,
  CAD: 62.11,
};

export const SUPPORTED_CURRENCIES = ['INR', 'USD', 'EUR', 'GBP', 'JPY', 'AED', 'SGD', 'CAD'] as const;

export function getCurrencySymbol(currency: string): string {
  const symbols: Record<string, string> = {
    INR: '₹', USD: '$', EUR: '€', GBP: '£', JPY: '¥', AED: 'د.إ', SGD: 'S$', CAD: 'C$',
  };
  return symbols[currency] ?? currency;
}

export function convertCurrency(amount: number, from: string, to: string): number {
  const fromRate = EXCHANGE_RATES_TO_INR[from] ?? 1;
  const toRate = EXCHANGE_RATES_TO_INR[to] ?? 1;
  return (amount * fromRate) / toRate;
}

export function fmt(n: number): string {
  return '₹' + n.toLocaleString('en-IN');
}

export function fmtShort(n: number): string {
  return fmtShortCur(n, 'INR');
}

export function fmtShortCur(n: number, currency = 'INR'): string {
  const sym = getCurrencySymbol(currency);
  const sign = n < 0 ? '-' : '';
  const abs = Math.abs(n);

  function trim(x: number) {
    const s = x.toFixed(2);
    return s.endsWith('.00') ? s.slice(0, -3) : s.replace(/0$/, '');
  }

  if (currency === 'INR') {
    if (abs >= 10_000_000) return sign + sym + trim(abs / 10_000_000) + ' Cr';
    if (abs >= 100_000)   return sign + sym + trim(abs / 100_000) + ' L';
    if (abs >= 1_000)     return sign + sym + trim(abs / 1_000) + 'k';
    return sign + sym + abs;
  }

  if (currency === 'JPY') {
    if (abs >= 1_000_000) return sign + sym + trim(abs / 1_000_000) + 'M';
    if (abs >= 1_000)     return sign + sym + trim(abs / 1_000) + 'K';
    return sign + sym + Math.round(abs);
  }

  if (abs >= 1_000_000_000) return sign + sym + trim(abs / 1_000_000_000) + 'B';
  if (abs >= 1_000_000)     return sign + sym + trim(abs / 1_000_000) + 'M';
  if (abs >= 1_000)         return sign + sym + trim(abs / 1_000) + 'K';
  return sign + sym + abs.toFixed(2);
}

export function fmtDate(isoDate: string | null | undefined): string {
  if (!isoDate) return "—";
  const d = new Date(isoDate + "T00:00:00");
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

export function fmtDateTime(iso: string | null | undefined): string {
  if (!iso) return "—";
  const d = new Date(iso);
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
    + ', '
    + d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
}
