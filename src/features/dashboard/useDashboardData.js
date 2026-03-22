import { useQuery } from "@tanstack/react-query";
import {
  getDashboardSummary,
  getMonthlyAnalytics,
  getCategoryExpense,
  getHealthScore,
  getBudgetAlert,
  getHeatmapData,
  getInsights,
} from "../../api/dashboardApi";

export default function useDashboardData() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;

  const summaryQuery = useQuery({
    queryKey: ["dashboard-summary"],
    queryFn: getDashboardSummary,
  });

  const monthlyQuery = useQuery({
    queryKey: ["dashboard-monthly", year],
    queryFn: () => getMonthlyAnalytics(year),
  });

  const categoryQuery = useQuery({
    queryKey: ["dashboard-category"],
    queryFn: getCategoryExpense,
  });

  const healthQuery = useQuery({
    queryKey: ["health-score", year, month],
    queryFn: () => getHealthScore(year, month),
  });

  const budgetQuery = useQuery({
    queryKey: ["budget-alert"],
    queryFn: getBudgetAlert,
  });

  const heatmapQuery = useQuery({
    queryKey: ["heatmap", year, month],
    queryFn: () => getHeatmapData(year, month),
  });

  const insightsQuery = useQuery({
    queryKey: ["insights", year, month],
    queryFn: () => getInsights(year, month),
  });

  return {
    summaryQuery,
    monthlyQuery,
    categoryQuery,
    healthQuery,
    budgetQuery,
    heatmapQuery,
    insightsQuery,
  };
}