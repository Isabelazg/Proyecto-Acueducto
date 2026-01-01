import { formatCurrency } from '../../../lib/utils';
import { usePeriodFee } from '../../../hooks/period/usePeriodFee';

export default function PeriodStats({ period, summary, totals, paidCount, peopleCount }) {
  const { showFeeForm, setShowFeeForm, feeAmount, setFeeAmount, setFeeMutation, handleFeeSubmit } = usePeriodFee(period);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <div className="stats shadow">
          <div className="stat">
            <div className="stat-title">Cuota Mensual Global</div>
            <div className="stat-value text-primary text-2xl">
              {summary.feeAmount ? formatCurrency(summary.feeAmount) : '-'}
            </div>
            <div className="stat-actions">
              <button className="btn btn-sm btn-outline" onClick={() => setShowFeeForm(!showFeeForm)}>
                {summary.feeAmount ? 'Cambiar' : 'Definir'}
              </button>
            </div>
          </div>
        </div>

        <div className="stats shadow">
          <div className="stat">
            <div className="stat-title">Cuotas Pagadas</div>
            <div className="stat-value text-primary text-2xl">
              {formatCurrency(totals.monthIn || 0)}
            </div>
            <div className="stat-desc">
              {paidCount} / {peopleCount} pagaron
            </div>
          </div>
        </div>

        <div className="stats shadow">
          <div className="stat">
            <div className="stat-title">Otros Ingresos</div>
            <div className="stat-value text-primary text-2xl">
              {formatCurrency(totals.otherIncome || 0)}
            </div>
            <div className="stat-desc">{totals.otherIncomeCount || 0} registros</div>
          </div>
        </div>

        <div className="stats shadow">
          <div className="stat">
            <div className="stat-title">Egresos del Mes</div>
            <div className="stat-value text-neutral text-2xl">
              {formatCurrency(totals.monthOut || 0)}
            </div>
            <div className="stat-desc">{totals.expenseCount || 0} gastos</div>
          </div>
        </div>

        <div className="stats shadow">
          <div className="stat">
            <div className="stat-title">Balance Total</div>
            <div className={`stat-value text-2xl ${totals.balance >= 0 ? 'text-info' : 'text-warning'}`}>
              {formatCurrency(totals.balance || 0)}
            </div>
            <div className="stat-desc">Acumulado histórico</div>
          </div>
        </div>
      </div>

      {showFeeForm && (
        <div className="card bg-base-100 shadow-xl mb-6">
          <div className="card-body">
            <form onSubmit={handleFeeSubmit}>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Cuota mensual (pesos colombianos)</span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Ej: 50000"
                    className="input input-bordered flex-1"
                    value={feeAmount}
                    onChange={(e) => setFeeAmount(e.target.value)}
                    required
                  />
                  <button type="submit" className="btn btn-primary" disabled={setFeeMutation.isPending}>
                    {setFeeMutation.isPending ? 'Guardando...' : 'Guardar'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
