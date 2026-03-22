import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getIncomes,
  getTotalIncome,
  getMonthlyIncomeTotal,
  createIncome,
  updateIncome,
  deleteIncome,
} from "../../api/incomeApi";

export default function useIncomeData() {
  const queryClient = useQueryClient();
  const now = new Date();

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());

  const incomesQuery = useQuery({
    queryKey: ["incomes"],
    queryFn: getIncomes,
  });

  const totalIncomeQuery = useQuery({
    queryKey: ["income-total"],
    queryFn: getTotalIncome,
  });

  const monthlyIncomeQuery = useQuery({
    queryKey: ["income-monthly-total", selectedYear, selectedMonth],
    queryFn: () => getMonthlyIncomeTotal(selectedYear, selectedMonth),
  });

  const addIncomeMutation = useMutation({
    mutationFn: createIncome,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["incomes"] });
      queryClient.invalidateQueries({ queryKey: ["income-total"] });
      queryClient.invalidateQueries({ queryKey: ["income-monthly-total"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-summary"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-monthly"] });
    },
  });

  const updateIncomeMutation = useMutation({
    mutationFn: updateIncome,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["incomes"] });
      queryClient.invalidateQueries({ queryKey: ["income-total"] });
      queryClient.invalidateQueries({ queryKey: ["income-monthly-total"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-summary"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-monthly"] });
    },
  });

  const deleteIncomeMutation = useMutation({
  mutationFn: deleteIncome,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["incomes"] });
    queryClient.invalidateQueries({ queryKey: ["income-total"] });
    queryClient.invalidateQueries({ queryKey: ["income-monthly-total"] });
    queryClient.invalidateQueries({ queryKey: ["dashboard-summary"] });
    queryClient.invalidateQueries({ queryKey: ["dashboard-monthly"] });
  },
  onError: (error) => {
    console.error("Delete income API error:", error?.response?.data || error);
  },
});

  const incomes = incomesQuery.data || [];

  const categories = useMemo(() => {
    const unique = [...new Set(incomes.map((item) => item.category).filter(Boolean))];
    return ["All", ...unique];
  }, [incomes]);

  const filteredIncomes = useMemo(() => {
    return incomes.filter((item) => {
      const itemDate = item.date ? new Date(item.date) : null;
      const matchesCategory =
        selectedCategory === "All" || item.category === selectedCategory;

      const matchesMonth =
        itemDate &&
        itemDate.getMonth() + 1 === selectedMonth &&
        itemDate.getFullYear() === selectedYear;

      return matchesCategory && matchesMonth;
    });
  }, [incomes, selectedCategory, selectedMonth, selectedYear]);

  const sourceBreakdown = useMemo(() => {
    const map = {};

    filteredIncomes.forEach((item) => {
      const key = item.category || item.source || "Other";
      map[key] = (map[key] || 0) + Number(item.amount || 0);
    });

    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [filteredIncomes]);

  return {
    incomesQuery,
    totalIncomeQuery,
    monthlyIncomeQuery,
    addIncomeMutation,
    updateIncomeMutation,
    deleteIncomeMutation,
    incomes,
    filteredIncomes,
    categories,
    sourceBreakdown,
    selectedCategory,
    setSelectedCategory,
    selectedMonth,
    setSelectedMonth,
    selectedYear,
    setSelectedYear,
  };
}