import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-16">
      <div className="bg-zinc-800/50 p-8 rounded-lg w-full max-w-sm border border-zinc-700">
        <Link to="/" className="text-red-600 text-2xl font-bold block text-center mb-6">StreamVault</Link>
        <h1 className="text-2xl font-semibold mb-6 text-center">Sign In</h1>

        {error && <p className="bg-red-600/20 text-red-400 text-sm p-3 rounded mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full bg-zinc-700 border border-zinc-600 rounded px-4 py-3 text-sm outline-none focus:border-red-600 transition"
              required
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full bg-zinc-700 border border-zinc-600 rounded px-4 py-3 text-sm outline-none focus:border-red-600 transition"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded transition disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-zinc-400">
          New to StreamVault?{' '}
          <Link to="/register" className="text-white hover:underline">Sign up now</Link>
        </p>
      </div>
    </div>
  );
}
