import { useQuery } from '@tanstack/react-query';
import { api } from '../../lib/api';

export function useBalance() {
  const { data, isLoading } = useQuery({
    queryKey: ['balance'],
    queryFn: api.getBalance,
  });

  const balance = data?.balance || 0;
  const totalIn = data?.totalIn || 0;
  const totalOut = data?.totalOut || 0;

  return {
    balance,
    totalIn,
    totalOut,
    isLoading,
  };
}
