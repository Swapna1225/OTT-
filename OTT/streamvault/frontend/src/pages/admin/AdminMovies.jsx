import { useState, useEffect } from 'react';
import { content as contentApi } from '../../api/client';
import { GridSkeleton } from '../../components/ui/Skeleton';
import { HiPencil, HiTrash } from 'react-icons/hi';

export default function AdminMovies() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [type, setType] = useState('movies');

  const fetchData = () => {
    setLoading(true);
    const fetcher = type === 'movies' ? contentApi.getMovies : contentApi.getSeries;
    fetcher({ page, limit: 20 })
      .then(({ data }) => {
        setMovies(type === 'movies' ? data.movies : data.series);
        setTotalPages(data.pages || 1);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, [page, type]);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Content Management</h1>
        <div className="flex gap-2">
          <button onClick={() => { setType('movies'); setPage(1); }}
            className={`px-4 py-1.5 rounded text-sm transition ${type === 'movies' ? 'bg-red-600 text-white' : 'bg-zinc-700 text-zinc-300 hover:bg-zinc-600'}`}>
            Movies
          </button>
          <button onClick={() => { setType('series'); setPage(1); }}
            className={`px-4 py-1.5 rounded text-sm transition ${type === 'series' ? 'bg-red-600 text-white' : 'bg-zinc-700 text-zinc-300 hover:bg-zinc-600'}`}>
            Series
          </button>
        </div>
      </div>

      {loading ? <GridSkeleton count={8} /> : (
        <div className="bg-zinc-800 rounded-lg border border-zinc-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-700 text-zinc-400">
                  <th className="text-left p-3">Title</th>
                  <th className="text-left p-3 hidden md:table-cell">Year</th>
                  <th className="text-left p-3 hidden md:table-cell">Genres</th>
                  <th className="text-center p-3">Rating</th>
                  <th className="text-center p-3">Featured</th>
                </tr>
              </thead>
              <tbody>
                {movies.map((movie) => (
                  <tr key={movie._id} className="border-b border-zinc-700/50 hover:bg-zinc-700/30">
                    <td className="p-3">
                      <div className="flex items-center gap-3">
                        <img src={movie.posterUrl || ''} alt="" className="w-10 h-14 object-cover rounded" />
                        <span className="font-medium truncate max-w-[200px]">{movie.title}</span>
                      </div>
                    </td>
                    <td className="p-3 hidden md:table-cell text-zinc-400">{movie.releaseYear || '—'}</td>
                    <td className="p-3 hidden md:table-cell">
                      <div className="flex flex-wrap gap-1">
                        {movie.genres?.slice(0, 2).map(g => (
                          <span key={g} className="bg-zinc-700 px-2 py-0.5 rounded text-xs">{g}</span>
                        ))}
                      </div>
                    </td>
                    <td className="p-3 text-center">{movie.rating?.toFixed(1) || '—'}</td>
                    <td className="p-3 text-center">{movie.featured ? '⭐' : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 p-4">
              <button disabled={page <= 1} onClick={() => setPage(p => p - 1)}
                className="px-3 py-1 bg-zinc-700 rounded text-sm disabled:opacity-50 hover:bg-zinc-600">Prev</button>
              <span className="text-sm text-zinc-400">Page {page} of {totalPages}</span>
              <button disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}
                className="px-3 py-1 bg-zinc-700 rounded text-sm disabled:opacity-50 hover:bg-zinc-600">Next</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
