import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { content as contentApi } from '../api/client';
import { HiPlay, HiPlus, HiInformationCircle } from 'react-icons/hi';

export default function HeroBanner() {
  const [movie, setMovie] = useState(null);

  useEffect(() => {
    contentApi.getFeatured().then(({ data }) => setMovie(data.movie)).catch(() => {});
  }, []);

  if (!movie) return <div className="h-[70vh] bg-zinc-800 animate-pulse" />;

  return (
    <div className="relative h-[70vh] md:h-[80vh] w-full">
      <div className="absolute inset-0">
        <img
          src={movie.backdropUrl || 'https://via.placeholder.com/1920x1080/1a1a2e/fff?text=StreamVault'}
          alt={movie.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/30 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-zinc-900/80 via-transparent to-transparent" />
      </div>

      <div className="relative z-10 h-full flex items-end pb-20 px-4 md:px-10">
        <div className="max-w-2xl">
          <h1 className="text-4xl md:text-6xl font-bold mb-3">{movie.title}</h1>
          <div className="flex items-center gap-3 text-sm text-zinc-300 mb-3">
            <span className="text-green-400 font-medium">{movie.rating?.toFixed(1)} Rating</span>
            <span>{movie.releaseYear}</span>
            <span className="border border-zinc-500 px-1 text-xs">{movie.maturityRating}</span>
          </div>
          <p className="text-zinc-300 text-sm md:text-base line-clamp-3 mb-6">
            {movie.description || 'No description available.'}
          </p>
          <div className="flex items-center gap-3">
            <Link
              to={`/watch/${movie._id}`}
              className="flex items-center gap-2 bg-white text-black font-semibold px-6 py-2.5 rounded hover:bg-white/90 transition"
            >
              <HiPlay className="w-5 h-5" /> Play
            </Link>
            <Link
              to={`/movie/${movie._id}`}
              className="flex items-center gap-2 bg-zinc-500/50 text-white font-semibold px-6 py-2.5 rounded hover:bg-zinc-500/70 transition"
            >
              <HiInformationCircle className="w-5 h-5" /> More Info
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
