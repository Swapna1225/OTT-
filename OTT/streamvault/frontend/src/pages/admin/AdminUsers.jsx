import { useState, useEffect } from 'react';
import api from '../../api/client';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/api/auth/me')
      .then(() => {
        // For demo we show current user info; in production this would list all users
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">User Management</h1>
      <div className="bg-zinc-800 rounded-lg border border-zinc-700 p-8 text-center">
        <p className="text-zinc-400 mb-2">User management available in production build</p>
        <p className="text-zinc-500 text-sm">Full CRUD for users will be available with admin endpoints</p>
      </div>
    </div>
  );
}
