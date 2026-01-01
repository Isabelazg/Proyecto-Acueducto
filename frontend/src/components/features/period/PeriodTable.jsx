import { useParams } from 'react-router-dom';
import { usePeriodData } from '../../../hooks/period/usePeriodData';
import PeriodHeader from './PeriodHeader';
import PeriodStats from './PeriodStats';
import PeriodPayments from './PeriodPayments';
import PeriodExpenses from './PeriodExpenses';
import PeriodIncomes from './PeriodIncomes';
import LoadingSpinner from '../../common/LoadingSpinner';

export default function PeriodTable() {
  const { period } = useParams();
  const { summary, people, expenses, otherIncomes, totals, paidCount, isLoading } = usePeriodData(period);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="max-w-6xl mx-auto">
      <PeriodHeader
        period={period}
        summary={summary}
        people={people}
        expenses={expenses}
        otherIncomes={otherIncomes}
        totals={totals}
        paidCount={paidCount}
      />

      <PeriodStats
        period={period}
        summary={summary}
        totals={totals}
        paidCount={paidCount}
        peopleCount={people.length}
      />

      <PeriodPayments
        period={period}
        people={people}
        summary={summary}
      />

      <PeriodExpenses
        period={period}
        expenses={expenses}
      />

      <PeriodIncomes
        period={period}
        otherIncomes={otherIncomes}
      />
    </div>
  );
}