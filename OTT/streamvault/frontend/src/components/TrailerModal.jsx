import { useEffect, useRef } from 'react';
import { HiX } from 'react-icons/hi';

export default function TrailerModal({ trailerUrl, title, onClose }) {
  const overlayRef = useRef(null);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) onClose();
  };

  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  return (
    <div ref={overlayRef} onClick={handleOverlayClick} className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
      <div className="relative w-full max-w-4xl bg-black rounded-lg overflow-hidden">
        <div className="absolute top-4 right-4 z-10">
          <button onClick={onClose} className="bg-black/60 p-2 rounded-full hover:bg-black/80 transition">
            <HiX className="w-5 h-5" />
          </button>
        </div>
        <div className="aspect-video">
          {trailerUrl ? (
            <iframe
              src={trailerUrl.replace('watch?v=', 'embed/')}
              className="w-full h-full"
              allow="autoplay; fullscreen"
              allowFullScreen
              title={`${title} Trailer`}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-zinc-900">
              <p className="text-zinc-500">No trailer available</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
