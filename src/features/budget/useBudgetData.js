import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getBudget, saveBudget, getBudgetAlerts } from "../../api/budgetApi";

export default function useBudgetData() {
  const queryClient = useQueryClient();

  const budgetQuery = useQuery({
    queryKey: ["budget"],
    queryFn: getBudget,
  });

  const alertsQuery = useQuery({
    queryKey: ["budget-alerts"],
    queryFn: getBudgetAlerts,
  });

  const saveBudgetMutation = useMutation({
    mutationFn: saveBudget,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["budget"] });
      queryClient.invalidateQueries({ queryKey: ["budget-alerts"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-summary"] });
    },
  });

  return {
    budgetQuery,
    alertsQuery,
    saveBudgetMutation,
  };
}