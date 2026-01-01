import { useQuery } from '@tanstack/react-query';
import { api } from '../../lib/api';

export function usePeriodData(period) {
  const { data, isLoading } = useQuery({
    queryKey: ['period', period],
    queryFn: () => api.getPeriodSummary(period),
  });

  const summary = data || {};
  const people = summary.people || [];
  const expenses = summary.expenses || [];
  const otherIncomes = summary.otherIncomes || [];
  const totals = summary.totals || {};
  const paidCount = people.filter((p) => p.paid).length;

  return {
    summary,
    people,
    expenses,
    otherIncomes,
    totals,
    paidCount,
    isLoading,
  };
}