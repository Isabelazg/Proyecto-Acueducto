import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/api';

export function usePeriodPayment(period) {
  const queryClient = useQueryClient();

  const paymentMutation = useMutation({
    mutationFn: (personId) => api.createPayment(period, { personId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['period', period] });
      queryClient.invalidateQueries({ queryKey: ['balance'] });
    },
  });

  return {
    paymentMutation,
  };
}