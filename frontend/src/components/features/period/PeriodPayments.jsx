import { formatCurrency, formatDateTime } from '../../../lib/utils';
import { usePeriodPayment } from '../../../hooks/period/usePeriodPayment';
import { usePeriodDelete } from '../../../hooks/period/usePeriodDelete';
import EmptyState from '../../common/EmptyState';

export default function PeriodPayments({ period, people, summary }) {
  const { paymentMutation } = usePeriodPayment(period);
  const { deletePaymentMutation } = usePeriodDelete(period);

  return (
    <div className="card bg-base-100 shadow-xl mb-6">
      <div className="card-body">
        <h2 className="card-title">Pagos del Mes</h2>
        <div className="alert alert-info mb-4">
          <span>💡 La cuota global aplica a todos. Si alguien paga diferente, define su cuota individual en Personas.</span>
        </div>
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>Persona</th>
                <th>Cuota a Pagar</th>
                <th>Estado</th>
                <th>Monto Pagado</th>
                <th>Fecha</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {people.length === 0 ? (
                <EmptyState
                  colSpan={6}
                  title="No hay personas activas. Ve a la sección Personas para agregar."
                />
              ) : (
                people.map((person) => {
                  const feeToUse = person.monthlyFee || summary.feeAmount;
                  const hasCustomFee = Boolean(person.monthlyFee);
                  
                  return (
                    <tr key={person.id}>
                      <td>{person.name}</td>
                      <td>
                        {feeToUse ? (
                          <div className="flex items-center gap-2">
                            <span className={hasCustomFee ? 'font-semibold text-warning' : ''}>
                              {formatCurrency(feeToUse)}
                            </span>
                            {hasCustomFee && (
                              <span className="badge badge-warning badge-sm">Individual</span>
                            )}
                          </div>
                        ) : (
                          <span className="text-base-content/60 text-sm">Sin cuota</span>
                        )}
                      </td>
                      <td>
                        <span className={`badge ${person.paid ? 'badge-success' : 'badge-ghost'}`}>
                          {person.paid ? '✓ Pagado' : 'Pendiente'}
                        </span>
                      </td>
                      <td>
                        {person.payment ? formatCurrency(person.payment.amount) : '-'}
                      </td>
                      <td>
                        {person.payment ? formatDateTime(person.payment.paidAt) : '-'}
                      </td>
                      <td>
                        {person.paid ? (
                          <button
                            className="btn btn-sm btn-error btn-outline"
                            onClick={() => deletePaymentMutation.mutate(person.payment.id)}
                            disabled={deletePaymentMutation.isPending}
                          >
                            Eliminar
                          </button>
                        ) : (
                          <button
                            className="btn btn-sm btn-primary"
                            onClick={() => paymentMutation.mutate(person.id)}
                            disabled={paymentMutation.isPending || !feeToUse}
                            title={!feeToUse ? 'Define la cuota global o individual primero' : ''}
                          >
                            Registrar Pago
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
