export function formatCurrency(amount: number): string {
  return "₹" + new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 0,
  }).format(amount);
}
