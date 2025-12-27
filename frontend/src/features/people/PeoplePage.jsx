import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/api';
import { formatCurrency } from '../../lib/utils';

export function PeoplePage() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [newName, setNewName] = useState('');
  const [newFee, setNewFee] = useState('');
  const [editingFee, setEditingFee] = useState(null);
  const [editFeeValue, setEditFeeValue] = useState('');
  const [filter, setFilter] = useState('active');

  const { data, isLoading } = useQuery({
    queryKey: ['people', filter],
    queryFn: () => api.getPeople(filter === 'all' ? {} : { active: filter === 'active' }),
  });

  const createMutation = useMutation({
    mutationFn: api.createPerson,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['people'] });
      setNewName('');
      setNewFee('');
      setShowForm(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => api.updatePerson(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['people'] });
      queryClient.invalidateQueries({ queryKey: ['period'] });
      setEditingFee(null);
      setEditFeeValue('');
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newName.trim()) {
      const fee = newFee ? parseInt(newFee) : undefined;
      createMutation.mutate({ name: newName.trim(), monthlyFee: fee });
    }
  };

  const toggleActive = (person) => {
    updateMutation.mutate({
      id: person.id,
      data: { active: !person.active },
    });
  };

  const startEditFee = (person) => {
    setEditingFee(person.id);
    setEditFeeValue(person.monthlyFee || '');
  };

  const saveFee = (personId) => {
    const fee = editFeeValue ? parseInt(editFeeValue) : null;
    updateMutation.mutate({
      id: personId,
      data: { monthlyFee: fee },
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  const people = data?.people || [];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold">Gestión de Personas</h1>
          <p className="text-base-content/60 mt-1">Administra las personas del acueducto y sus cuotas</p>
        </div>
        <button 
          className={`btn ${showForm ? 'btn-ghost' : 'btn-neutral'} gap-2`}
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? (
            <>
              <span>✕</span> Cancelar
            </>
          ) : (
            <>
              <span>+</span> Agregar Persona
            </>
          )}
        </button>
      </div>

      {showForm && (
        <div className="card bg-base-100 shadow-xl mb-6">
          <div className="card-body">
            <h3 className="text-lg font-semibold mb-4">Nueva Persona</h3>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Nombre completo</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Ej: Juan Pérez"
                    className="input input-bordered w-full"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    required
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Cuota Individual</span>
                  </label>
                  <input
                    type="number"
                    placeholder="Ej: 50000 (opcional)"
                    className="input input-bordered w-full"
                    value={newFee}
                    onChange={(e) => setNewFee(e.target.value)}
                  />
                  <label className="label">
                    <span className="label-text-alt text-info">
                      💡 Deja vacío para usar la cuota global del periodo
                    </span>
                  </label>
                </div>
              </div>
              <div className="flex gap-2 justify-end">
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => {
                    setShowForm(false);
                    setNewName('');
                    setNewFee('');
                  }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn btn-neutral"
                  disabled={createMutation.isPending}
                >
                  {createMutation.isPending ? (
                    <>
                      <span className="loading loading-spinner loading-sm"></span>
                      Guardando...
                    </>
                  ) : (
                    '✓ Guardar'
                  )}
                </button>
              </div>
              {createMutation.isError && (
                <div className="alert alert-error mt-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Error: {createMutation.error.response?.data?.error || 'Error al crear persona'}</span>
                </div>
              )}
            </form>
          </div>
        </div>
      )}

      <div className="flex gap-2 mb-4">
        <button
          className={`btn ${filter === 'active' ? 'btn-primary' : 'btn-ghost'}`}
          onClick={() => setFilter('active')}
        >
          <span className="text-success">●</span>
          Activos
        </button>
        <button
          className={`btn ${filter === 'inactive' ? 'btn-primary' : 'btn-ghost'}`}
          onClick={() => setFilter('inactive')}
        >
          <span className="text-error">●</span>
          Inactivos
        </button>
        <button
          className={`btn ${filter === 'all' ? 'btn-primary' : 'btn-ghost'}`}
          onClick={() => setFilter('all')}
        >
          Todos
        </button>
      </div>

      <div className="card bg-base-100 shadow-xl">
        <div className="card-body p-0">
          <div className="overflow-x-auto">
            <table className="table table-zebra">
              <thead className="bg-base-200">
                <tr>
                  <th className="font-bold">Nombre</th>
                  <th className="font-bold">Cuota Individual</th>
                  <th className="font-bold">Estado</th>
                  <th className="font-bold text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {people.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center py-12">
                      <div className="flex flex-col items-center gap-2 text-base-content/60">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <span className="font-medium">No hay personas registradas</span>
                        <span className="text-sm">Agrega la primera persona para comenzar</span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  people.map((person) => (
                    <tr key={person.id} className="hover">
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
                                disabled={updateMutation.isPending}
                                title="Guardar"
                              >
                                ✓
                              </button>
                              <button
                                className="btn btn-sm btn-ghost join-item"
                                onClick={() => {
                                  setEditingFee(null);
                                  setEditFeeValue('');
                                }}
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
                          disabled={updateMutation.isPending}
                        >
                          {updateMutation.isPending ? (
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
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
