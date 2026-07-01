import { useState } from 'react';
import { content as contentApi } from '../../api/client';
import { useToast } from '../../context/ToastContext';

export default function AdminSync() {
  const toast = useToast();
  const [syncing, setSyncing] = useState(false);
  const [result, setResult] = useState(null);

  const handleSync = async (type) => {
    setSyncing(true);
    setResult(null);
    try {
      const { data } = await contentApi.syncFromTMDB({ type, count: 20 });
      setResult(data);
      toast(`Synced ${data.total} new titles`, 'success');
    } catch (err) {
      const msg = err.response?.data?.message || 'Sync failed';
      toast(msg, 'error');
      setResult({ error: msg });
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">TMDB Content Sync</h1>

      <div className="bg-zinc-800 rounded-lg border border-zinc-700 p-6 mb-6">
        <p className="text-zinc-300 text-sm mb-4">
          Pull trending content from The Movie Database (TMDB). Requires a valid TMDB API key in the backend .env file.
        </p>
        <div className="flex flex-wrap gap-3">
          <button onClick={() => handleSync('movie')} disabled={syncing}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2.5 rounded font-medium text-sm transition disabled:opacity-50 flex items-center gap-2">
            {syncing && <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />}
            Sync Movies
          </button>
          <button onClick={() => handleSync('tv')} disabled={syncing}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded font-medium text-sm transition disabled:opacity-50 flex items-center gap-2">
            {syncing && <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />}
            Sync TV Series
          </button>
        </div>
      </div>

      {result && (
        <div className={`rounded-lg border p-4 ${result.error ? 'bg-red-600/10 border-red-600/30' : 'bg-green-600/10 border-green-600/30'}`}>
          <p className="text-sm">{result.error || `Successfully synced ${result.total} new titles from TMDB.`}</p>
        </div>
      )}

      <div className="bg-zinc-800 rounded-lg border border-zinc-700 p-6 mt-6">
        <h2 className="text-lg font-semibold mb-3">Setup Instructions</h2>
        <ol className="text-sm text-zinc-300 space-y-2 list-decimal list-inside">
          <li>Create a free account at <a href="https://www.themoviedb.org" target="_blank" rel="noreferrer" className="text-red-400 hover:underline">themoviedb.org</a></li>
          <li>Go to API settings and request an API key</li>
          <li>Add <code className="bg-zinc-700 px-1 rounded">TMDB_API_KEY=your_key</code> to <code className="bg-zinc-700 px-1 rounded">backend/.env</code></li>
          <li>Restart the backend server</li>
          <li>Click Sync above to pull trending content</li>
        </ol>
      </div>
    </div>
  );
}
