import { useState, useEffect } from 'react';
import { content as contentApi, user as userApi } from '../api/client';
import { useAuth } from '../context/AuthContext';
import HeroBanner from '../components/HeroBanner';
import Row from '../components/Row';
import { RowSkeleton, HeroSkeleton } from '../components/ui/Skeleton';

export default function Home() {
  const { user } = useAuth();
  const [trending, setTrending] = useState([]);
  const [popular, setPopular] = useState([]);
  const [recent, setRecent] = useState([]);
  const [continueWatching, setContinueWatching] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const promises = [
      contentApi.getMovies({ sort: '-rating', limit: 20 }),
      contentApi.getMovies({ sort: '-createdAt', limit: 20 }),
      contentApi.getSeries({ limit: 20 }),
    ];

    if (user) {
      promises.push(userApi.getHistory());
    }

    Promise.all(promises).then(([trendRes, recentRes, seriesRes, historyRes]) => {
      setTrending(trendRes.data.movies);
      setPopular(seriesRes.data.series);
      setRecent(recentRes.data.movies);
      if (historyRes) {
        const continueList = (historyRes.data.history || [])
          .filter(w => w.progress > 0 && w.progress < 100 && w.movie)
          .slice(0, 20)
          .map(w => ({ ...w.movie, progress: w.progress }));
        setContinueWatching(continueList);
      }
    }).catch(() => {}).finally(() => setLoading(false));
  }, [user]);

  if (loading) return <div className="min-h-screen bg-zinc-900"><HeroSkeleton /><RowSkeleton /><RowSkeleton /></div>;

  return (
    <div className="pt-0">
      <HeroBanner />
      <div className="-mt-20 relative z-20">
        {continueWatching.length > 0 && (
          <Row title="Continue Watching" movies={continueWatching} />
        )}
        <Row title="Trending Now" movies={trending} />
        <Row title="Popular Series" movies={popular} />
        <Row title="Recently Added" movies={recent} />
      </div>
    </div>
  );
}
