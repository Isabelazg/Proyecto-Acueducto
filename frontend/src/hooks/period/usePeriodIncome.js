import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/api';

export function usePeriodIncome(period) {
  const queryClient = useQueryClient();
  const [showIncomeForm, setShowIncomeForm] = useState(false);
  const [incomeAmount, setIncomeAmount] = useState('');
  const [incomeDesc, setIncomeDesc] = useState('');

  const incomeMutation = useMutation({
    mutationFn: (data) => api.createOtherIncome(period, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['period', period] });
      queryClient.invalidateQueries({ queryKey: ['balance'] });
      setIncomeAmount('');
      setIncomeDesc('');
      setShowIncomeForm(false);
    },
  });

  const handleIncomeSubmit = (e) => {
    e.preventDefault();
    const amount = parseInt(incomeAmount);
    if (!isNaN(amount) && amount > 0 && incomeDesc.trim()) {
      incomeMutation.mutate({
        amount,
        description: incomeDesc.trim(),
      });
    }
  };

  return {
    showIncomeForm,
    setShowIncomeForm,
    incomeAmount,
    setIncomeAmount,
    incomeDesc,
    setIncomeDesc,
    incomeMutation,
    handleIncomeSubmit,
  };
}