import { usePeopleTable } from '../../../hooks/people/usePeopleTable';
import PeopleCreate from './PeopleCreate';
import PeopleStatus from './PeopleStatus';
import PeopleEdit from './PeopleEdit';
import LoadingSpinner from '../../common/LoadingSpinner';
import EmptyState from '../../common/EmptyState';

export default function PeopleTable() {
  const { people, isLoading, filter, setFilter } = usePeopleTable();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="max-w-6xl mx-auto">
      <PeopleCreate />
      
      <PeopleStatus filter={filter} setFilter={setFilter} />

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
                  <EmptyState
                    colSpan={4}
                    icon={
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    }
                    title="No hay personas registradas"
                    description="Agrega la primera persona para comenzar"
                  />
                ) : (
                  people.map((person) => (
                    <PeopleEdit key={person.id} person={person} />
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
