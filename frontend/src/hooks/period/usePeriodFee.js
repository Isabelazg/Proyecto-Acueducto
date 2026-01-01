import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/api';

export function usePeriodFee(period) {
  const queryClient = useQueryClient();
  const [showFeeForm, setShowFeeForm] = useState(false);
  const [feeAmount, setFeeAmount] = useState('');

  const setFeeMutation = useMutation({
    mutationFn: (amount) => api.setFee(period, { amount }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['period', period] });
      setFeeAmount('');
      setShowFeeForm(false);
    },
  });

  const handleFeeSubmit = (e) => {
    e.preventDefault();
    const amount = parseInt(feeAmount);
    if (!isNaN(amount) && amount > 0) {
      setFeeMutation.mutate(amount);
    }
  };

  return {
    showFeeForm,
    setShowFeeForm,
    feeAmount,
    setFeeAmount,
    setFeeMutation,
    handleFeeSubmit,
  };
}