import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getExpenses,
  getTotalExpenses,
  getMonthlyExpenseTotal,
  createExpense,
  updateExpense,
  deleteExpense,
} from "../../api/expenseApi";

export default function useExpensesData() {
  const queryClient = useQueryClient();
  const now = new Date();

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());

  const expensesQuery = useQuery({
    queryKey: ["expenses"],
    queryFn: getExpenses,
  });

  const totalExpensesQuery = useQuery({
    queryKey: ["expenses-total"],
    queryFn: getTotalExpenses,
  });

  const monthlyExpenseQuery = useQuery({
    queryKey: ["expenses-monthly-total", selectedYear, selectedMonth],
    queryFn: () => getMonthlyExpenseTotal(selectedYear, selectedMonth),
  });

  const addExpenseMutation = useMutation({
    mutationFn: createExpense,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      queryClient.invalidateQueries({ queryKey: ["expenses-total"] });
      queryClient.invalidateQueries({ queryKey: ["expenses-monthly-total"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-summary"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-monthly"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-category"] });
    },
  });

  const updateExpenseMutation = useMutation({
    mutationFn: updateExpense,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      queryClient.invalidateQueries({ queryKey: ["expenses-total"] });
      queryClient.invalidateQueries({ queryKey: ["expenses-monthly-total"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-summary"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-monthly"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-category"] });
    },
  });

  const deleteExpenseMutation = useMutation({
    mutationFn: deleteExpense,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      queryClient.invalidateQueries({ queryKey: ["expenses-total"] });
      queryClient.invalidateQueries({ queryKey: ["expenses-monthly-total"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-summary"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-monthly"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-category"] });
    },
  });

  const expenses = expensesQuery.data || [];

  const categories = useMemo(() => {
    const unique = [...new Set(expenses.map((item) => item.category).filter(Boolean))];
    return ["All", ...unique];
  }, [expenses]);

  const filteredExpenses = useMemo(() => {
    return expenses.filter((item) => {
      const itemDate = item.date ? new Date(item.date) : null;
      const matchesCategory =
        selectedCategory === "All" || item.category === selectedCategory;

      const matchesMonth =
        itemDate &&
        itemDate.getMonth() + 1 === selectedMonth &&
        itemDate.getFullYear() === selectedYear;

      return matchesCategory && matchesMonth;
    });
  }, [expenses, selectedCategory, selectedMonth, selectedYear]);

  const categoryBreakdown = useMemo(() => {
    const map = {};

    filteredExpenses.forEach((item) => {
      const key = item.category || "Other";
      map[key] = (map[key] || 0) + Number(item.amount || 0);
    });

    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [filteredExpenses]);

  return {
    expensesQuery,
    totalExpensesQuery,
    monthlyExpenseQuery,
    addExpenseMutation,
    updateExpenseMutation,
    deleteExpenseMutation,
    expenses,
    filteredExpenses,
    categories,
    categoryBreakdown,
    selectedCategory,
    setSelectedCategory,
    selectedMonth,
    setSelectedMonth,
    selectedYear,
    setSelectedYear,
  };
}