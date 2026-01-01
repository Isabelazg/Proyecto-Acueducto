import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/api';

export function usePeriodDelete(period) {
  const queryClient = useQueryClient();

  const deletePaymentMutation = useMutation({
    mutationFn: api.deletePayment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['period', period] });
      queryClient.invalidateQueries({ queryKey: ['balance'] });
    },
  });

  const deleteExpenseMutation = useMutation({
    mutationFn: api.deleteExpense,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['period', period] });
      queryClient.invalidateQueries({ queryKey: ['balance'] });
    },
  });

  const deleteIncomeMutation = useMutation({
    mutationFn: api.deleteOtherIncome,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['period', period] });
      queryClient.invalidateQueries({ queryKey: ['balance'] });
    },
  });

  return {
    deletePaymentMutation,
    deleteExpenseMutation,
    deleteIncomeMutation,
  };
}