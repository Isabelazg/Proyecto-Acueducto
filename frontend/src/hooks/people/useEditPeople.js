import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/api';

export function useEditPeople() {
  const queryClient = useQueryClient();
  const [editingFee, setEditingFee] = useState(null);
  const [editFeeValue, setEditFeeValue] = useState('');

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => api.updatePerson(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['people'] });
      queryClient.invalidateQueries({ queryKey: ['period'] });
      setEditingFee(null);
      setEditFeeValue('');
    },
  });

  const startEditFee = (person) => {
    setEditingFee(person.id);
    setEditFeeValue(person.monthlyFee || '');
  };

  const saveFee = (personId) => {
    const fee = editFeeValue ? parseInt(editFeeValue) : null;
    updateMutation.mutate({
      id: personId,
      data: { monthlyFee: fee },
    });
  };

  const cancelEditFee = () => {
    setEditingFee(null);
    setEditFeeValue('');
  };

  return {
    editingFee,
    editFeeValue,
    setEditFeeValue,
    updateMutation,
    startEditFee,
    saveFee,
    cancelEditFee,
  };
}