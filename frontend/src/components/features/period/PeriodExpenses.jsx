import { formatCurrency, formatDateTime } from '../../../lib/utils';
import { usePeriodExpense } from '../../../hooks/period/usePeriodExpense';
import { usePeriodDelete } from '../../../hooks/period/usePeriodDelete';
import EmptyState from '../../common/EmptyState';

export default function PeriodExpenses({ period, expenses }) {
  const {
    showExpenseForm,
    setShowExpenseForm,
    expenseAmount,
    setExpenseAmount,
    expenseDesc,
    setExpenseDesc,
    expenseMutation,
    handleExpenseSubmit,
  } = usePeriodExpense(period);

  const { deleteExpenseMutation } = usePeriodDelete(period);

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <div className="flex justify-between items-center mb-4">
          <h2 className="card-title">Gastos del Mes</h2>
          <button
            className="btn btn-sm btn-neutral"
            onClick={() => setShowExpenseForm(!showExpenseForm)}
          >
            {showExpenseForm ? 'Cancelar' : '+ Agregar Gasto'}
          </button>
        </div>

        {showExpenseForm && (
          <form onSubmit={handleExpenseSubmit} className="mb-4 p-4 bg-base-200 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Descripción</span>
                </label>
                <input
                  type="text"
                  placeholder="Ej: Reparación bomba"
                  className="input input-bordered"
                  value={expenseDesc}
                  onChange={(e) => setExpenseDesc(e.target.value)}
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
                    placeholder="Ej: 120000"
                    className="input input-bordered flex-1"
                    value={expenseAmount}
                    onChange={(e) => setExpenseAmount(e.target.value)}
                    required
                  />
                  <button type="submit" className="btn btn-neutral" disabled={expenseMutation.isPending}>
                    {expenseMutation.isPending ? 'Guardando...' : 'Guardar'}
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
              {expenses.length === 0 ? (
                <EmptyState
                  colSpan={4}
                  title="No hay gastos registrados este mes"
                />
              ) : (
                expenses.map((expense) => (
                  <tr key={expense.id}>
                    <td>{expense.description}</td>
                    <td className="text-error font-semibold">
                      {formatCurrency(expense.amount)}
                    </td>
                    <td>{formatDateTime(expense.spentAt)}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-error btn-outline"
                        onClick={() => deleteExpenseMutation.mutate(expense.id)}
                        disabled={deleteExpenseMutation.isPending}
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
