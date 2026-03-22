import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getRecurringItems,
  createRecurringItem,
  updateRecurringItem,
  deleteRecurringItem,
} from "../../api/recurringApi";

export default function useRecurringData() {
  const queryClient = useQueryClient();

  const recurringQuery = useQuery({
    queryKey: ["recurring-items"],
    queryFn: getRecurringItems,
  });

  const createRecurringMutation = useMutation({
    mutationFn: createRecurringItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recurring-items"] });
    },
  });

  const updateRecurringMutation = useMutation({
    mutationFn: updateRecurringItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recurring-items"] });
    },
  });

  const deleteRecurringMutation = useMutation({
    mutationFn: deleteRecurringItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recurring-items"] });
    },
  });

  return {
    recurringQuery,
    createRecurringMutation,
    updateRecurringMutation,
    deleteRecurringMutation,
  };
}