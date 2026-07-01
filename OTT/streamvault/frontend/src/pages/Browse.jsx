import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { content as contentApi } from '../api/client';
import MovieCard from '../components/MovieCard';

export default function Browse() {
  const { type = 'movies' } = useParams();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [genre, setGenre] = useState('');
  const [genres, setGenres] = useState([]);

  const isMovie = type === 'movies';

  useEffect(() => {
    contentApi.getGenres().then(({ data }) => {
      setGenres(isMovie ? data.movieGenres : data.seriesGenres);
    }).catch(() => {});
  }, [isMovie]);

  useEffect(() => {
    setLoading(true);
    const fetcher = isMovie ? contentApi.getMovies : contentApi.getSeries;
    fetcher({ genre: genre || undefined, limit: 50 })
      .then(({ data }) => setItems(isMovie ? data.movies : data.series))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [isMovie, genre]);

  return (
    <div className="min-h-screen pt-20 px-4 md:px-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <h1 className="text-3xl font-bold capitalize">{type}</h1>
        <select
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
          className="bg-zinc-800 border border-zinc-600 text-white px-4 py-2 rounded text-sm outline-none"
        >
          <option value="">All Genres</option>
          {genres.map((g) => (
            <option key={g} value={g}>{g}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
          {Array.from({ length: 18 }).map((_, i) => (
            <div key={i} className="aspect-[2/3] bg-zinc-800 rounded animate-pulse" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-20 text-zinc-500">
          <p className="text-xl mb-2">No content available</p>
          <p className="text-sm">Sync content from TMDB in the admin panel</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
          {items.map((item) => (
            <MovieCard key={item._id} movie={item} />
          ))}
        </div>
      )}
    </div>
  );
}
