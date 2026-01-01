export default function PeopleStatus({ filter, setFilter }) {

  return (
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
  );
}
