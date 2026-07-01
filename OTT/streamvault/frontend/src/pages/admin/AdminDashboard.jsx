import { useState, useEffect } from 'react';
import { content as contentApi } from '../../api/client';
import { HiFilm, HiUsers, HiStar, HiFire } from 'react-icons/hi';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ movies: 0, series: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      contentApi.getMovies({ limit: 1 }),
      contentApi.getSeries({ limit: 1 }),
    ]).then(([moviesRes, seriesRes]) => {
      setStats({ movies: moviesRes.data.total || 0, series: seriesRes.data.total || 0 });
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const cards = [
    { label: 'Total Movies', value: stats.movies, icon: HiFilm, color: 'bg-red-600' },
    { label: 'Total Series', value: stats.series, icon: HiStar, color: 'bg-blue-600' },
    { label: 'Users', value: '—', icon: HiUsers, color: 'bg-green-600' },
    { label: 'Trending', value: '—', icon: HiFire, color: 'bg-purple-600' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cards.map((card) => (
          <div key={card.label} className="bg-zinc-800 rounded-lg border border-zinc-700 p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-zinc-400 text-sm">{card.label}</span>
              <div className={`${card.color} p-2 rounded`}>
                <card.icon className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-bold">
              {loading ? <span className="animate-pulse">...</span> : card.value}
            </p>
          </div>
        ))}
      </div>

      <div className="bg-zinc-800 rounded-lg border border-zinc-700 p-6">
        <h2 className="text-lg font-semibold mb-3">Quick Actions</h2>
        <div className="grid sm:grid-cols-3 gap-3">
          <a href="/admin/sync" className="bg-zinc-700 hover:bg-zinc-600 rounded p-4 text-center text-sm transition">
            Sync from TMDB
          </a>
          <a href="/admin/movies" className="bg-zinc-700 hover:bg-zinc-600 rounded p-4 text-center text-sm transition">
            Manage Content
          </a>
          <a href="/" className="bg-zinc-700 hover:bg-zinc-600 rounded p-4 text-center text-sm transition">
            View Site
          </a>
        </div>
      </div>
    </div>
  );
}
