import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAccounts,
  createAccount,
  updateAccount,
  deleteAccount,
   transferMoney,
} from "../../api/accountsApi";

export default function useAccountsData() {

  const queryClient = useQueryClient();

  const accountsQuery = useQuery({
    queryKey: ["accounts"],
    queryFn: getAccounts,
  });

  const createAccountMutation = useMutation({
    mutationFn: createAccount,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
    },
  });

  const updateAccountMutation = useMutation({
    mutationFn: updateAccount,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
    },
  });

  const deleteAccountMutation = useMutation({
    mutationFn: deleteAccount,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
    },
  });
  const transferMutation = useMutation({
  mutationFn: transferMoney,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["accounts"] });
  },
});

  return {
    accountsQuery,
    createAccountMutation,
    updateAccountMutation,
    deleteAccountMutation,
    transferMutation,
  };
}