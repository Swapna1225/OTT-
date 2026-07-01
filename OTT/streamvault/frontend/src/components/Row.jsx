import { useRef } from 'react';
import MovieCard from './MovieCard';
import { HiChevronLeft, HiChevronRight } from 'react-icons/hi';

export default function Row({ title, movies }) {
  const rowRef = useRef(null);

  const scroll = (direction) => {
    if (rowRef.current) {
      const amount = direction === 'left' ? -800 : 800;
      rowRef.current.scrollBy({ left: amount, behavior: 'smooth' });
    }
  };

  if (!movies?.length) return null;

  return (
    <section className="mb-8 px-4 md:px-10">
      <h2 className="text-xl md:text-2xl font-semibold mb-4 text-white">{title}</h2>
      <div className="relative group">
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 top-0 bottom-0 z-10 w-12 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center hover:bg-black/60"
        >
          <HiChevronLeft className="w-6 h-6" />
        </button>
        <div ref={rowRef} className="flex gap-2 overflow-x-scroll scrollbar-hide pb-2">
          {movies.map((movie) => (
            <MovieCard key={movie._id} movie={movie} />
          ))}
        </div>
        <button
          onClick={() => scroll('right')}
          className="absolute right-0 top-0 bottom-0 z-10 w-12 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center hover:bg-black/60"
        >
          <HiChevronRight className="w-6 h-6" />
        </button>
      </div>
    </section>
  );
}
