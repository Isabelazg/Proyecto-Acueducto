import { formatCurrency, formatDateTime } from '../../../lib/utils';
import { usePeriodIncome } from '../../../hooks/period/usePeriodIncome';
import { usePeriodDelete } from '../../../hooks/period/usePeriodDelete';
import EmptyState from '../../common/EmptyState';

export default function PeriodIncomes({ period, otherIncomes }) {
  const {
    showIncomeForm,
    setShowIncomeForm,
    incomeAmount,
    setIncomeAmount,
    incomeDesc,
    setIncomeDesc,
    incomeMutation,
    handleIncomeSubmit,
  } = usePeriodIncome(period);

  const { deleteIncomeMutation } = usePeriodDelete(period);

  return (
    <div className="card bg-base-100 shadow-xl mt-6">
      <div className="card-body">
        <div className="flex justify-between items-center mb-4">
          <h2 className="card-title">Otros Ingresos</h2>
          <button
            className="btn btn-sm btn-neutral"
            onClick={() => setShowIncomeForm(!showIncomeForm)}
          >
            {showIncomeForm ? 'Cancelar' : '+ Agregar Ingreso'}
          </button>
        </div>

        {showIncomeForm && (
          <form onSubmit={handleIncomeSubmit} className="mb-4 p-4 bg-base-200 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Descripción</span>
                </label>
                <input
                  type="text"
                  placeholder="Ej: Donación, Subsidio, etc."
                  className="input input-bordered"
                  value={incomeDesc}
                  onChange={(e) => setIncomeDesc(e.target.value)}
                  required
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Monto</span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Ej: 50000"
                    className="input input-bordered flex-1"
                    value={incomeAmount}
                    onChange={(e) => setIncomeAmount(e.target.value)}
                    required
                  />
                  <button type="submit" className="btn btn-neutral" disabled={incomeMutation.isPending}>
                    {incomeMutation.isPending ? 'Guardando...' : 'Guardar'}
                  </button>
                </div>
              </div>
            </div>
          </form>
        )}

        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>Descripción</th>
                <th>Monto</th>
                <th>Fecha</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {otherIncomes.length === 0 ? (
                <EmptyState
                  colSpan={4}
                  title="No hay otros ingresos registrados este mes"
                />
              ) : (
                otherIncomes.map((income) => (
                  <tr key={income.id}>
                    <td>{income.description}</td>
                    <td className="text-info font-semibold">
                      {formatCurrency(income.amount)}
                    </td>
                    <td>{formatDateTime(income.receivedAt)}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-error btn-outline"
                        onClick={() => deleteIncomeMutation.mutate(income.id)}
                        disabled={deleteIncomeMutation.isPending}
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
