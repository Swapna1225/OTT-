import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-black text-zinc-500 text-xs px-4 md:px-10 py-8 mt-10">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-wrap gap-6 mb-6">
          <Link to="/" className="hover:text-white transition">Home</Link>
          <Link to="/browse/movies" className="hover:text-white transition">Movies</Link>
          <Link to="/browse/series" className="hover:text-white transition">Series</Link>
          <span>Contact Us</span>
          <span>Privacy Policy</span>
          <span>Terms of Service</span>
        </div>
        <p>&copy; {new Date().getFullYear()} StreamVault. All rights reserved. This is a demo project.</p>
      </div>
    </footer>
  );
}
