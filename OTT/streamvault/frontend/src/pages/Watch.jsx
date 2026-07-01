import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { content as contentApi, user as userApi } from '../api/client';
import VideoPlayer from '../components/VideoPlayer';
import { HiArrowLeft, HiPlay, HiInformationCircle } from 'react-icons/hi';

export default function Watch() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showInfo, setShowInfo] = useState(false);

  useEffect(() => {
    contentApi.getMovieById(id)
      .then(({ data }) => setMovie(data.movie))
      .catch(() => navigate('/'))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  const handleProgress = (pct) => {
    userApi.updateProgress({ movieId: id, progress: Math.round(pct) }).catch(() => {});
  };

  if (loading) return <div className="min-h-screen bg-black" />;
  if (!movie) return null;

  return (
    <div className="relative min-h-screen bg-black">
      <div className={`absolute top-4 left-4 z-20 transition-opacity duration-300 ${showInfo ? 'opacity-0' : 'opacity-100'}`}>
        <button onClick={() => navigate(-1)} className="bg-black/40 p-2 rounded-full hover:bg-black/60">
          <HiArrowLeft className="w-5 h-5" />
        </button>
      </div>

      <div className="relative max-w-6xl mx-auto">
        <VideoPlayer
          src={movie.videoUrl}
          poster={movie.backdropUrl}
          onProgress={handleProgress}
          onEnded={() => handleProgress(100)}
        />
      </div>

      <div className="max-w-6xl mx-auto p-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">{movie.title}</h1>
          <div className="flex items-center gap-2 text-sm text-zinc-400 mt-1">
            <span className="text-green-400">{movie.rating?.toFixed(1)}</span>
            <span>{movie.releaseYear}</span>
            <span className="border border-zinc-600 px-1 text-xs">{movie.maturityRating}</span>
          </div>
        </div>
        <Link to={`/movie/${movie._id}`} className="flex items-center gap-1 text-sm text-zinc-300 hover:text-white transition">
          <HiInformationCircle className="w-4 h-4" /> More Info
        </Link>
      </div>
    </div>
  );
}
