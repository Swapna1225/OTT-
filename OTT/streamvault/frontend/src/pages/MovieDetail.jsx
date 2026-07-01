import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { content as contentApi, ratings as ratingsApi } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { useWatchlist } from '../context/WatchlistContext';
import { useToast } from '../context/ToastContext';
import TrailerModal from '../components/TrailerModal';
import { HiPlay, HiPlus, HiCheck, HiArrowLeft, HiStar, HiFilm } from 'react-icons/hi';

export default function MovieDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const toast = useToast();
  const { isInWatchlist, addToWatchlist, removeFromWatchlist } = useWatchlist();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userRating, setUserRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [showTrailer, setShowTrailer] = useState(false);

  useEffect(() => {
    contentApi.getMovieById(id)
      .then(({ data }) => setMovie(data.movie))
      .catch(() => navigate('/'))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  useEffect(() => {
    if (user && movie) {
      ratingsApi.getUserRating(movie._id)
        .then(({ data }) => setUserRating(data.rating))
        .catch(() => {});
    }
  }, [user, movie]);

  const handleRate = async (score) => {
    if (!user) { navigate('/login'); return; }
    try {
      await ratingsApi.rateMovie({ movieId: movie._id, score });
      setUserRating(score);
      toast('Rating saved!', 'success');
    } catch (err) {
      toast('Failed to save rating', 'error');
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-zinc-900">
      <div className="h-[50vh] bg-zinc-800 animate-pulse" />
    </div>
  );
  if (!movie) return null;

  const inList = isInWatchlist(movie._id);

  return (
    <div className="min-h-screen bg-zinc-900">
      <div className="relative h-[50vh] md:h-[60vh]">
        <img
          src={movie.backdropUrl || movie.posterUrl}
          alt={movie.title}
          className="w-full h-full object-cover"
          onError={(e) => { e.target.src = 'https://via.placeholder.com/1920x1080/1a1a2e/fff?text=StreamVault'; }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/40 to-transparent" />
        <button onClick={() => navigate(-1)} className="absolute top-20 left-4 md:left-10 z-10 bg-black/40 p-2 rounded-full hover:bg-black/60">
          <HiArrowLeft className="w-5 h-5" />
        </button>
      </div>

      <div className="relative z-10 -mt-32 px-4 md:px-10 max-w-5xl">
        <h1 className="text-3xl md:text-5xl font-bold mb-3">{movie.title}</h1>
        <div className="flex items-center gap-3 text-sm text-zinc-300 mb-4 flex-wrap">
          <span className="text-green-400 font-medium">{movie.rating?.toFixed(1)} Rating</span>
          <span>{movie.releaseYear}</span>
          <span className="border border-zinc-500 px-1 text-xs">{movie.maturityRating}</span>
          {movie.duration && <span>{movie.duration} min</span>}
          <span className="flex items-center gap-1"><HiFilm className="w-4 h-4" /> {movie.isMovie ? 'Movie' : 'Series'}</span>
        </div>

        <div className="flex items-center gap-3 mb-6 flex-wrap">
          <button
            onClick={() => user ? navigate(`/watch/${movie._id}`) : navigate('/login')}
            className="flex items-center gap-2 bg-white text-black font-semibold px-8 py-3 rounded hover:bg-white/90 transition"
          >
            <HiPlay className="w-5 h-5" /> Play
          </button>
          {user && (
            <button
              onClick={() => inList ? removeFromWatchlist(movie._id) : addToWatchlist(movie._id)}
              className="flex items-center gap-2 bg-zinc-600 text-white px-8 py-3 rounded hover:bg-zinc-500 transition"
            >
              {inList ? <HiCheck className="w-5 h-5" /> : <HiPlus className="w-5 h-5" />}
              {inList ? 'In My List' : 'Add to List'}
            </button>
          )}
          <button
            onClick={() => setShowTrailer(true)}
            className="flex items-center gap-2 bg-zinc-700 text-white px-6 py-3 rounded hover:bg-zinc-600 transition text-sm"
          >
            Trailer
          </button>
        </div>

        <div className="mb-6">
          <p className="text-sm text-zinc-400 mb-2">Rate this {movie.isMovie ? 'movie' : 'series'}:</p>
          <div className="flex items-center gap-1">
            {[1,2,3,4,5,6,7,8,9,10].map((star) => (
              <button
                key={star}
                onClick={() => handleRate(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className="transition-transform hover:scale-110"
              >
                <HiStar className={`w-5 h-5 ${
                  star <= (hoverRating || userRating) ? 'text-yellow-400' : 'text-zinc-600'
                }`} />
              </button>
            ))}
            {userRating > 0 && <span className="text-xs text-zinc-400 ml-2">Your rating: {userRating}/10</span>}
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 pb-10">
          <div className="md:col-span-2">
            <h3 className="text-lg font-semibold mb-2">Synopsis</h3>
            <p className="text-zinc-300 leading-relaxed">{movie.description || 'No description available.'}</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Genres</h3>
            <div className="flex flex-wrap gap-2">
              {movie.genres?.length > 0 ? movie.genres.map((g) => (
                <span key={g} className="bg-zinc-800 px-3 py-1 rounded text-sm text-zinc-300">{g}</span>
              )) : <span className="text-zinc-500 text-sm">No genres listed</span>}
            </div>
          </div>
        </div>
      </div>

      {showTrailer && (
        <TrailerModal
          trailerUrl={movie.trailerUrl}
          title={movie.title}
          onClose={() => setShowTrailer(false)}
        />
      )}
    </div>
  );
}
