import { useWatchlist } from '../context/WatchlistContext';
import MovieCard from '../components/MovieCard';

export default function Watchlist() {
  const { watchlist, loading } = useWatchlist();

  return (
    <div className="min-h-screen pt-20 px-4 md:px-10">
      <h1 className="text-2xl font-bold mb-6">My List</h1>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="aspect-[2/3] bg-zinc-800 rounded animate-pulse" />
          ))}
        </div>
      ) : watchlist.length === 0 ? (
        <div className="text-center py-20 text-zinc-500">
          <p className="text-xl mb-2">Your list is empty</p>
          <p className="text-sm">Browse movies and add them to your watchlist</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
          {watchlist.map((movie) => (
            <MovieCard key={movie._id} movie={movie} />
          ))}
        </div>
      )}
    </div>
  );
}
