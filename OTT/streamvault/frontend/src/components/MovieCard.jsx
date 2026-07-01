import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useWatchlist } from '../context/WatchlistContext';
import { useAuth } from '../context/AuthContext';
import { HiPlay, HiPlus, HiCheck } from 'react-icons/hi';

export default function MovieCard({ movie }) {
  const { isInWatchlist, addToWatchlist, removeFromWatchlist } = useWatchlist();
  const { user } = useAuth();
  const [imgLoaded, setImgLoaded] = useState(false);
  const inList = isInWatchlist(movie._id);

  const handleToggleList = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (inList) removeFromWatchlist(movie._id);
    else addToWatchlist(movie._id);
  };

  return (
    <Link to={`/movie/${movie._id}`} className="group relative flex-shrink-0 w-[160px] md:w-[200px] transition-transform duration-300 hover:scale-105">
      <div className="relative aspect-[2/3] rounded-md overflow-hidden bg-zinc-800">
        {!imgLoaded && <div className="absolute inset-0 animate-pulse bg-zinc-700" />}
        <img
          src={movie.posterUrl || 'https://via.placeholder.com/300x450/1a1a2e/fff?text=No+Poster'}
          alt={movie.title}
          className={`w-full h-full object-cover transition-opacity duration-300 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setImgLoaded(true)}
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
          <HiPlay className="w-12 h-12 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </div>
      <div className="mt-2">
        <h3 className="text-sm font-medium text-zinc-200 truncate">{movie.title}</h3>
        <div className="flex items-center justify-between mt-1">
          <div className="flex items-center gap-2 text-xs text-zinc-400">
            <span>{movie.releaseYear}</span>
            <span className="text-green-400">{movie.rating?.toFixed(1)}</span>
          </div>
          {user && (
            <button onClick={handleToggleList} className="text-zinc-400 hover:text-white">
              {inList ? <HiCheck className="w-4 h-4 text-green-400" /> : <HiPlus className="w-4 h-4" />}
            </button>
          )}
        </div>
      </div>
    </Link>
  );
}
