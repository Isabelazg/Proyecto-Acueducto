import { useCreatePeople } from '../../../hooks/people/useCreatePeople';

export default function PeopleCreate() {
  const {
    showForm,
    setShowForm,
    newName,
    setNewName,
    newFee,
    setNewFee,
    createMutation,
    handleSubmit,
    cancelForm,
  } = useCreatePeople();

  return (
    <>
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
                  onClick={cancelForm}
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
    </>
  );
}
