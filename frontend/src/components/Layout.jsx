import { Outlet, NavLink } from 'react-router-dom';
import { getCurrentPeriod } from '../lib/utils';

export function Layout() {
  const currentPeriod = getCurrentPeriod();

  return (
    <div className="min-h-screen bg-base-200">
      <div className="navbar bg-base-100 shadow-lg">
        <div className="flex-1">
          <NavLink to="/" className="btn btn-ghost text-xl">
            💧 Acueducto
          </NavLink>
        </div>
        <div className="flex-none">
          <ul className="menu menu-horizontal px-1">
            <li>
              <NavLink
                to={`/periodo/${currentPeriod}`}
                className={({ isActive }) => (isActive ? 'active' : '')}
              >
                Periodo
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/personas"
                className={({ isActive }) => (isActive ? 'active' : '')}
              >
                Personas
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/balance"
                className={({ isActive }) => (isActive ? 'active' : '')}
              >
                Balance
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
      <main className="container mx-auto p-4">
        <Outlet />
      </main>
    </div>
  );
}
