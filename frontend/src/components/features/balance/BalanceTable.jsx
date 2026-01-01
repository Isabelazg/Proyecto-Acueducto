import { useBalance } from '../../../hooks/balance/useBalance';
import { formatCurrency } from '../../../lib/utils';
import LoadingSpinner from '../../common/LoadingSpinner';

export default function BalanceTable() {
  const { balance, totalIn, totalOut, isLoading } = useBalance();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Balance General</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card bg-success text-success-content">
          <div className="card-body">
            <h2 className="card-title">Total Ingresos</h2>
            <p className="text-3xl font-bold">{formatCurrency(totalIn)}</p>
          </div>
        </div>

        <div className="card bg-error text-error-content">
          <div className="card-body">
            <h2 className="card-title">Total Egresos</h2>
            <p className="text-3xl font-bold">{formatCurrency(totalOut)}</p>
          </div>
        </div>

        <div className={`card ${balance >= 0 ? 'bg-primary' : 'bg-warning'} text-base-100`}>
          <div className="card-body">
            <h2 className="card-title">Balance</h2>
            <p className="text-3xl font-bold">{formatCurrency(balance)}</p>
          </div>
        </div>
      </div>

      <div className="alert alert-info mt-6">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          className="stroke-current shrink-0 w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          ></path>
        </svg>
        <span>
          Este es el balance acumulado desde el inicio del sistema. Para ver detalles de un mes
          específico, ve a la sección de Periodo.
        </span>
      </div>
    </div>
  );
}
