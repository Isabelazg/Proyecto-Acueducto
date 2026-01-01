import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/api';

export function usePeriodExpense(period) {
  const queryClient = useQueryClient();
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [expenseAmount, setExpenseAmount] = useState('');
  const [expenseDesc, setExpenseDesc] = useState('');

  const expenseMutation = useMutation({
    mutationFn: (data) => api.createExpense(period, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['period', period] });
      queryClient.invalidateQueries({ queryKey: ['balance'] });
      setExpenseAmount('');
      setExpenseDesc('');
      setShowExpenseForm(false);
    },
  });

  const handleExpenseSubmit = (e) => {
    e.preventDefault();
    const amount = parseInt(expenseAmount);
    if (!isNaN(amount) && amount > 0 && expenseDesc.trim()) {
      expenseMutation.mutate({
        amount,
        description: expenseDesc.trim(),
      });
    }
  };

  return {
    showExpenseForm,
    setShowExpenseForm,
    expenseAmount,
    setExpenseAmount,
    expenseDesc,
    setExpenseDesc,
    expenseMutation,
    handleExpenseSubmit,
  };
}