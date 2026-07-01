import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { content as contentApi } from '../api/client';
import MovieCard from '../components/MovieCard';

export default function Search() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query) { setResults([]); return; }
    setLoading(true);
    contentApi.search({ q: query, limit: 30 })
      .then(({ data }) => setResults(data.movies || []))
      .catch(() => setResults([]))
      .finally(() => setLoading(false));
  }, [query]);

  return (
    <div className="min-h-screen pt-20 px-4 md:px-10">
      <h1 className="text-2xl font-bold mb-6">
        {query ? `Results for "${query}"` : 'Search'}
      </h1>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="aspect-[2/3] bg-zinc-800 rounded animate-pulse" />
          ))}
        </div>
      ) : results.length === 0 && query ? (
        <div className="text-center py-20 text-zinc-500">
          <p className="text-xl mb-2">No results found</p>
          <p className="text-sm">Try different keywords</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
          {results.map((movie) => (
            <MovieCard key={movie._id} movie={movie} />
          ))}
        </div>
      )}
    </div>
  );
}
