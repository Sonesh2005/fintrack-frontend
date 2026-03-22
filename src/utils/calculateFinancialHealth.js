export default function calculateFinancialHealth(summary = {}, alerts = {}) {
  const totalIncome = summary.totalIncome ?? 0;
  const totalExpense = summary.totalExpense ?? 0;
  const savings = summary.savings ?? totalIncome - totalExpense;
  const budgetStatus = alerts.status ?? "NO_BUDGET";

  let score = 50;

  if (totalIncome > 0) {
    const spendingRatio = (totalExpense / totalIncome) * 100;

    if (spendingRatio < 50) score += 25;
    else if (spendingRatio < 75) score += 15;
    else if (spendingRatio < 90) score += 5;
    else score -= 10;
  }

  if (savings > 0) score += 15;
  else score -= 10;

  if (budgetStatus === "SAFE") score += 10;
  if (budgetStatus === "WARNING") score -= 5;
  if (budgetStatus === "EXCEEDED") score -= 15;

  score = Math.max(0, Math.min(100, Math.round(score)));

  const message =
    score >= 80
      ? "Excellent financial stability"
      : score >= 65
      ? "Healthy money trend"
      : score >= 50
      ? "Moderate financial position"
      : "Needs spending control";

  const colorClass =
    score >= 80
      ? "text-emerald-400"
      : score >= 65
      ? "text-cyan-400"
      : score >= 50
      ? "text-amber-400"
      : "text-red-400";

  return {
    score,
    message,
    colorClass,
  };
}