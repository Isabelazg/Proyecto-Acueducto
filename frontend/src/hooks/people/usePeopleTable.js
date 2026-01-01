import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../lib/api';

export function usePeopleTable() {
  const [filter, setFilter] = useState('active');

  const { data, isLoading } = useQuery({
    queryKey: ['people', filter],
    queryFn: () => api.getPeople(filter === 'all' ? {} : { active: filter === 'active' }),
  });

  const people = data?.people || [];

  return {
    people,
    isLoading,
    filter,
    setFilter,
  };
}