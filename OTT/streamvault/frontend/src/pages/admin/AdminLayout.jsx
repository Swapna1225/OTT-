import { Outlet, Link, useLocation } from 'react-router-dom';

const navItems = [
  { path: '/admin', label: 'Dashboard', exact: true },
  { path: '/admin/movies', label: 'Movies', exact: false },
  { path: '/admin/users', label: 'Users', exact: false },
  { path: '/admin/sync', label: 'TMDB Sync', exact: false },
];

export default function AdminLayout() {
  const location = useLocation();

  const isActive = (item) => {
    if (item.exact) return location.pathname === item.path;
    return location.pathname.startsWith(item.path);
  };

  return (
    <div className="min-h-screen bg-zinc-900 pt-16">
      <div className="bg-zinc-800 border-b border-zinc-700 px-4 md:px-10">
        <div className="flex items-center gap-1 overflow-x-auto">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition whitespace-nowrap ${
                isActive(item) ? 'border-red-600 text-white' : 'border-transparent text-zinc-400 hover:text-white'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
      <div className="p-4 md:p-10">
        <Outlet />
      </div>
    </div>
  );
}
