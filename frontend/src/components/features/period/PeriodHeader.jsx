import { usePeriodNav } from '../../../hooks/period/usePeriodNav';
import { usePeriodExport } from '../../../hooks/period/usePeriodExport';

export default function PeriodHeader({ period, summary, people, expenses, otherIncomes, totals, paidCount }) {
  const { handlePeriodChange } = usePeriodNav();
  const { downloadExcel } = usePeriodExport();

  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-3xl font-bold">Periodo {period}</h1>
      <div className="flex gap-2">
        <button
          className="btn btn-neutral gap-2"
          onClick={() => downloadExcel(period, summary, people, expenses, otherIncomes, totals, paidCount)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
          Descargar Excel
        </button>
        <input
          type="month"
          className="input input-bordered"
          value={period}
          onChange={handlePeriodChange}
        />
      </div>
    </div>
  );
}
