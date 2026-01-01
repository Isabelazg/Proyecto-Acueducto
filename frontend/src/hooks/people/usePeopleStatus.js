import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/api';

export function usePeopleStatus() {
  const queryClient = useQueryClient();

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => api.updatePerson(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['people'] });
      queryClient.invalidateQueries({ queryKey: ['period'] });
    },
  });

  const toggleActive = (person) => {
    updateMutation.mutate({
      id: person.id,
      data: { active: !person.active },
    });
  };

  return {
    updateMutation,
    toggleActive,
  };
}