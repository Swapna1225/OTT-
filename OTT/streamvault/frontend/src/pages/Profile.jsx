import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { auth as authApi } from '../api/client';
import { useToast } from '../context/ToastContext';

const avatars = [
  'https://via.placeholder.com/100/ff4444/fff?text=U1',
  'https://via.placeholder.com/100/44ff44/fff?text=U2',
  'https://via.placeholder.com/100/4444ff/fff?text=U3',
  'https://via.placeholder.com/100/ff44ff/fff?text=U4',
  'https://via.placeholder.com/100/ffff44/fff?text=U5',
  'https://via.placeholder.com/100/44ffff/fff?text=U6',
];

export default function Profile() {
  const { user } = useAuth();
  const toast = useToast();
  const [name, setName] = useState(user?.name || '');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await authApi.updateProfile({ name });
      toast('Profile updated successfully', 'success');
    } catch (err) {
      toast(err.response?.data?.message || 'Update failed', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen pt-20 px-4 md:px-10 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Profile</h1>

      <div className="bg-zinc-800/50 rounded-lg border border-zinc-700 p-6 mb-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center text-2xl font-bold">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-xl font-semibold">{user?.name}</h2>
            <p className="text-zinc-400 text-sm">{user?.email}</p>
            {user?.isAdmin && <span className="text-xs bg-red-600/20 text-red-400 px-2 py-0.5 rounded mt-1 inline-block">Admin</span>}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-zinc-400 mb-1">Name</label>
            <input
              type="text" value={name} onChange={(e) => setName(e.target.value)}
              className="w-full bg-zinc-700 border border-zinc-600 rounded px-4 py-2 text-sm outline-none focus:border-red-600"
            />
          </div>
          <div>
            <label className="block text-sm text-zinc-400 mb-1">Email</label>
            <input type="email" value={user?.email} disabled
              className="w-full bg-zinc-800 border border-zinc-700 rounded px-4 py-2 text-sm text-zinc-500 cursor-not-allowed" />
          </div>
          <button type="submit" disabled={saving}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded text-sm font-medium transition disabled:opacity-50">
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
}
