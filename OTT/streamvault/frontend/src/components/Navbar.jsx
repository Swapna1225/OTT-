import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { HiSearch, HiBell, HiChevronDown } from 'react-icons/hi';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
      setSearchOpen(false);
    }
  };

  return (
    <nav className="fixed top-0 z-50 w-full bg-gradient-to-b from-black/90 to-transparent px-4 md:px-10 py-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link to="/" className="text-red-600 text-2xl font-bold tracking-tight">StreamVault</Link>
          <div className="hidden md:flex items-center gap-5 text-sm text-zinc-300">
            <Link to="/" className="hover:text-white transition">Home</Link>
            <Link to="/browse/movies" className="hover:text-white transition">Movies</Link>
            <Link to="/browse/series" className="hover:text-white transition">Series</Link>
            {user && <Link to="/my-list" className="hover:text-white transition">My List</Link>}
            {user?.isAdmin && <Link to="/admin" className="hover:text-red-400 transition text-red-300">Admin</Link>}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <form onSubmit={handleSearch} className="hidden md:flex items-center">
            {searchOpen && (
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search titles..."
                className="bg-zinc-800 border border-zinc-500 px-3 py-1 text-sm rounded outline-none w-64"
                autoFocus
                onBlur={() => !searchQuery && setSearchOpen(false)}
              />
            )}
            <button type={searchOpen ? 'submit' : 'button'} onClick={() => setSearchOpen(true)}>
              <HiSearch className="w-5 h-5 text-zinc-300 hover:text-white" />
            </button>
          </form>

          {user ? (
            <div className="relative">
              <button onClick={() => setMenuOpen(!menuOpen)} className="flex items-center gap-1">
                <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center text-sm font-medium">
                  {user.name?.charAt(0).toUpperCase()}
                </div>
                <HiChevronDown className="w-4 h-4" />
              </button>
              {menuOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-zinc-800 border border-zinc-700 rounded shadow-lg py-1">
                  <div className="px-3 py-2 text-sm text-zinc-400 border-b border-zinc-700">{user.email}</div>
                  <button onClick={() => { setMenuOpen(false); navigate('/profile'); }} className="w-full text-left px-3 py-2 text-sm hover:bg-zinc-700">Profile</button>
                  <button onClick={() => { setMenuOpen(false); navigate('/my-list'); }} className="w-full text-left px-3 py-2 text-sm hover:bg-zinc-700">My List</button>
                  {user.isAdmin && <button onClick={() => { setMenuOpen(false); navigate('/admin'); }} className="w-full text-left px-3 py-2 text-sm hover:bg-zinc-700 text-red-300">Admin Panel</button>}
                  <button onClick={() => { setMenuOpen(false); logout(); }} className="w-full text-left px-3 py-2 text-sm hover:bg-zinc-700 text-red-400">Sign Out</button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/login" className="text-sm text-zinc-300 hover:text-white">Sign In</Link>
              <Link to="/register" className="bg-red-600 hover:bg-red-700 text-white text-sm px-4 py-1.5 rounded transition">Sign Up</Link>
            </div>
          )}

          <button className="md:hidden" onClick={() => setMobileMenu(!mobileMenu)}>
            <div className="space-y-1">
              <div className="w-5 h-0.5 bg-white"></div>
              <div className="w-5 h-0.5 bg-white"></div>
              <div className="w-5 h-0.5 bg-white"></div>
            </div>
          </button>
        </div>
      </div>

      {mobileMenu && (
        <div className="md:hidden mt-3 pb-3 flex flex-col gap-3 text-sm">
          <Link to="/" className="hover:text-white" onClick={() => setMobileMenu(false)}>Home</Link>
          <Link to="/browse/movies" className="hover:text-white" onClick={() => setMobileMenu(false)}>Movies</Link>
          <Link to="/browse/series" className="hover:text-white" onClick={() => setMobileMenu(false)}>Series</Link>
          {user && <Link to="/my-list" className="hover:text-white" onClick={() => setMobileMenu(false)}>My List</Link>}
          {user && <Link to="/profile" className="hover:text-white" onClick={() => setMobileMenu(false)}>Profile</Link>}
          {user?.isAdmin && <Link to="/admin" className="hover:text-red-400 text-red-300" onClick={() => setMobileMenu(false)}>Admin</Link>}
          {user && <button onClick={() => { logout(); setMobileMenu(false); }} className="text-left text-red-400">Sign Out</button>}
          <form onSubmit={(e) => { handleSearch(e); setMobileMenu(false); }}>
            <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search..." className="bg-zinc-800 border border-zinc-600 px-3 py-1.5 text-sm rounded w-full" />
          </form>
        </div>
      )}
    </nav>
  );
}
