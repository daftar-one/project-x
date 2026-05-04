export function fmt(n: number): string {
  return '₹' + n.toLocaleString('en-IN');
}

export function fmtShort(n: number): string {
  const sign = n < 0 ? '-' : '';
  const abs = Math.abs(n);

  function trim(x: number) {
    const s = x.toFixed(2);
    return s.endsWith('.00') ? s.slice(0, -3) : s.replace(/0$/, '');
  }

  if (abs >= 10000000) return sign + '₹' + trim(abs / 10000000) + ' Cr';
  if (abs >= 100000)   return sign + '₹' + trim(abs / 100000) + ' L';
  if (abs >= 1000)     return sign + '₹' + trim(abs / 1000) + 'k';
  return sign + '₹' + abs;
}

export function fmtDate(isoDate: string | null | undefined): string {
  if (!isoDate) return "—";
  const d = new Date(isoDate + "T00:00:00");
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}
