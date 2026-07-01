import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { user as userApi } from '../api/client';
import { useAuth } from './AuthContext';

const WatchlistContext = createContext(null);

export function WatchlistProvider({ children }) {
  const { user } = useAuth();
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchWatchlist = useCallback(async () => {
    if (!user) { setWatchlist([]); return; }
    setLoading(true);
    try {
      const { data } = await userApi.getWatchlist();
      setWatchlist(data.watchlist);
    } catch {
      setWatchlist([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => { fetchWatchlist(); }, [fetchWatchlist]);

  const addToWatchlist = async (movieId) => {
    await userApi.addToWatchlist(movieId);
    await fetchWatchlist();
  };

  const removeFromWatchlist = async (movieId) => {
    await userApi.removeFromWatchlist(movieId);
    await fetchWatchlist();
  };

  const isInWatchlist = (movieId) => {
    return watchlist.some(m => m._id === movieId);
  };

  return (
    <WatchlistContext.Provider value={{
      watchlist, loading, addToWatchlist, removeFromWatchlist, isInWatchlist, fetchWatchlist,
    }}>
      {children}
    </WatchlistContext.Provider>
  );
}

export const useWatchlist = () => {
  const context = useContext(WatchlistContext);
  if (!context) throw new Error('useWatchlist must be used within WatchlistProvider');
  return context;
};
