import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Inline Airbnb-style logo mark so we don't depend
function Logo() {
  return (
    <Link to="/" className="header__logo" aria-label="Airbnb home">
      <svg viewBox="0 0 32 32" width="30" height="30" fill="currentColor" aria-hidden="true">
        <path d="M16 1c-1.7 0-3 1.1-4.1 3.3L3.9 21.1c-1 2.1-1.1 3.9-.1 5.3.9 1.4 2.6 2.2 4.6 2.2 2 0 4.2-1 5.8-2.8l1.8-2 1.8 2c1.6 1.8 3.8 2.8 5.8 2.8 2 0 3.7-.8 4.6-2.2 1-1.4.9-3.2-.1-5.3L20.1 4.3C19 2.1 17.7 1 16 1zm0 3.7c.5 0 1 .5 1.5 1.5l5.1 10.8-2 2.4L16 14.2l-4.6 6.2-2-2.4L14.5 6.2c.5-1 1-1.5 1.5-1.5z" />
      </svg>
      <span className="header__brand">airbnb</span>
    </Link>
  );
}

function Header() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  // Close the dropdown when clicking anywhere outside of
  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setOpen(false);
    navigate('/login');
  };

  return (
    <header className="header">
      <div className="header__inner">
        <Logo />

        <nav className="header__nav">
          {isAuthenticated && (
            <>
              <Link to="/listings" className="header__link">
                Listings
              </Link>
              <Link to="/listings/create" className="header__link">
                Add listing
              </Link>
            </>
          )}
        </nav>

        <div className="header__right">
          {isAuthenticated ? (
            <>
              <span className="header__greeting">Hi, {user.username}</span>
              <div className="header__profile" ref={menuRef}>
                <button
                  className="header__avatar"
                  onClick={() => setOpen((o) => !o)}
                  aria-haspopup="true"
                  aria-expanded={open}
                >
                  <span className="header__avatar-initial">
                    {user.username?.charAt(0).toUpperCase()}
                  </span>
                </button>

                {open && (
                  <ul className="dropdown" role="menu">
                    <li>
                      <Link to="/reservations" role="menuitem" onClick={() => setOpen(false)}>
                        View reservations
                      </Link>
                    </li>
                    <li>
                      <Link to="/listings" role="menuitem" onClick={() => setOpen(false)}>
                        Manage listings
                      </Link>
                    </li>
                    <li className="dropdown__divider" />
                    <li>
                      <button role="menuitem" onClick={handleLogout}>
                        Log out
                      </button>
                    </li>
                  </ul>
                )}
              </div>
            </>
          ) : (
            <Link to="/login" className="header__host-link">
              Become a host
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
