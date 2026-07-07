import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoginModal from './LoginModal';

function Logo() {
  return (
    <Link to="/" className="nav__logo" aria-label="Airbnb home">
      <svg viewBox="0 0 32 32" width="30" height="30" fill="currentColor" aria-hidden="true">
        <path d="M16 1c-1.7 0-3 1.1-4.1 3.3L3.9 21.1c-1 2.1-1.1 3.9-.1 5.3.9 1.4 2.6 2.2 4.6 2.2 2 0 4.2-1 5.8-2.8l1.8-2 1.8 2c1.6 1.8 3.8 2.8 5.8 2.8 2 0 3.7-.8 4.6-2.2 1-1.4.9-3.2-.1-5.3L20.1 4.3C19 2.1 17.7 1 16 1zm0 3.7c.5 0 1 .5 1.5 1.5l5.1 10.8-2 2.4L16 14.2l-4.6 6.2-2-2.4L14.5 6.2c.5-1 1-1.5 1.5-1.5z" />
      </svg>
      <span className="nav__brand">airbnb</span>
    </Link>
  );
}

// Header / top navigation
function Header() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const [search, setSearch] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const onClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const q = search.trim();
    navigate(q ? `/location?location=${encodeURIComponent(q)}` : '/location');
  };

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate('/');
  };

  return (
    <header className="nav">
      <div className="nav__inner">
        <Logo />

        {/* Location filter */}
        <form className="nav__search" onSubmit={handleSearch}>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search destinations"
            aria-label="Search destinations"
          />
          <button type="submit" className="nav__search-btn" aria-label="Search">
            <svg
              viewBox="0 0 24 24"
              width="16"
              height="16"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
            >
              <circle cx="11" cy="11" r="7" />
              <line x1="16.5" y1="16.5" x2="22" y2="22" />
            </svg>
          </button>
        </form>

        {/* Profile section */}
        <div className="nav__profile" ref={menuRef}>
          {isAuthenticated && <span className="nav__hostlink">Become a host</span>}
          <button
            className="nav__menu-btn"
            onClick={() => (isAuthenticated ? setMenuOpen((o) => !o) : setShowLogin(true))}
            aria-haspopup="true"
            aria-expanded={menuOpen}
          >
            <svg
              viewBox="0 0 32 32"
              width="16"
              height="16"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
            >
              <line x1="2" y1="9" x2="30" y2="9" />
              <line x1="2" y1="16" x2="30" y2="16" />
              <line x1="2" y1="23" x2="30" y2="23" />
            </svg>
            <span className="nav__avatar">
              {isAuthenticated ? (
                user.username.charAt(0).toUpperCase()
              ) : (
                <svg viewBox="0 0 32 32" width="30" height="30" fill="currentColor">
                  <path d="M16 .7C7.6.7.8 7.5.8 16S7.6 31.3 16 31.3 31.2 24.5 31.2 16 24.4.7 16 .7zm0 4a5.3 5.3 0 1 1 0 10.6A5.3 5.3 0 0 1 16 4.7zm0 22.7a12.2 12.2 0 0 1-9.3-4.3c1.8-3 5.4-4.7 9.3-4.7s7.5 1.7 9.3 4.7A12.2 12.2 0 0 1 16 27.4z" />
                </svg>
              )}
            </span>
          </button>

          {isAuthenticated && menuOpen && (
            <ul className="dropdown" role="menu">
              <li className="dropdown__name">Hi, {user.username}</li>
              <li className="dropdown__divider" />
              <li>
                <Link to="/reservations" role="menuitem" onClick={() => setMenuOpen(false)}>
                  My reservations
                </Link>
              </li>
              <li>
                <button role="menuitem" onClick={handleLogout}>
                  Log out
                </button>
              </li>
            </ul>
          )}
        </div>
      </div>

      {showLogin && (
        <LoginModal onClose={() => setShowLogin(false)} onSuccess={() => setMenuOpen(false)} />
      )}
    </header>
  );
}

export default Header;
