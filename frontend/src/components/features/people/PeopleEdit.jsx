import { useEditPeople } from '../../../hooks/people/useEditPeople';
import { usePeopleStatus } from '../../../hooks/people/usePeopleStatus';
import { formatCurrency } from '../../../lib/utils';

export default function PeopleEdit({ person }) {
  const {
    editingFee,
    editFeeValue,
    setEditFeeValue,
    updateMutation: updateFeeMutation,
    startEditFee,
    saveFee,
    cancelEditFee,
  } = useEditPeople();

  const { updateMutation: updateStatusMutation, toggleActive } = usePeopleStatus();

  return (
    <tr className="hover">
      <td className="font-medium">{person.name}</td>
      <td>
        {editingFee === person.id ? (
          <div className="flex gap-2 items-center">
            <input
              type="number"
              className="input input-sm input-bordered w-36"
              value={editFeeValue}
              onChange={(e) => setEditFeeValue(e.target.value)}
              placeholder="Monto en pesos"
              autoFocus
            />
            <div className="join">
              <button
                className="btn btn-sm btn-success join-item"
                onClick={() => saveFee(person.id)}
                disabled={updateFeeMutation.isPending}
                title="Guardar"
              >
                ✓
              </button>
              <button
                className="btn btn-sm btn-ghost join-item"
                onClick={cancelEditFee}
                title="Cancelar"
              >
                ✕
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <span className={person.monthlyFee ? 'font-semibold text-warning' : 'text-base-content/60 italic'}>
              {person.monthlyFee ? formatCurrency(person.monthlyFee) : 'Usa global'}
            </span>
            <button
              className="btn btn-xs btn-ghost btn-circle"
              onClick={() => startEditFee(person)}
              title="Editar cuota individual"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
            </button>
          </div>
        )}
      </td>
      <td>
        <span className={`badge ${person.active ? 'badge-neutral' : 'badge-ghost'} gap-2`}>
          {person.active ? (
            <>
              <span className="w-2 h-2 rounded-full bg-neutral-content"></span>
              Activo
            </>
          ) : (
            <>
              <span className="w-2 h-2 rounded-full bg-base-content/30"></span>
              Inactivo
            </>
          )}
        </span>
      </td>
      <td className="text-center">
        <button
          className={`btn btn-sm ${person.active ? 'btn-ghost' : 'btn-neutral'} btn-outline gap-2`}
          onClick={() => toggleActive(person)}
          disabled={updateStatusMutation.isPending}
        >
          {updateStatusMutation.isPending ? (
            <span className="loading loading-spinner loading-xs"></span>
          ) : person.active ? (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M13.477 14.89A6 6 0 015.11 6.524l8.367 8.368zm1.414-1.414L6.524 5.11a6 6 0 018.367 8.367zM18 10a8 8 0 11-16 0 8 8 0 0116 0z" clipRule="evenodd" />
              </svg>
              Desactivar
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Activar
            </>
          )}
        </button>
      </td>
    </tr>
  );
}
