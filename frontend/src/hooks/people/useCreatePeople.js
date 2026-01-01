import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/api';

export function useCreatePeople() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [newName, setNewName] = useState('');
  const [newFee, setNewFee] = useState('');

  const createMutation = useMutation({
    mutationFn: api.createPerson,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['people'] });
      setNewName('');
      setNewFee('');
      setShowForm(false);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newName.trim()) {
      const fee = newFee ? parseInt(newFee) : undefined;
      createMutation.mutate({ name: newName.trim(), monthlyFee: fee });
    }
  };

  const cancelForm = () => {
    setShowForm(false);
    setNewName('');
    setNewFee('');
  };

  return {
    showForm,
    setShowForm,
    newName,
    setNewName,
    newFee,
    setNewFee,
    createMutation,
    handleSubmit,
    cancelForm,
  };
}