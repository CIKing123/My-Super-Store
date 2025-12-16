import { Search, ShoppingCart, User, Menu, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface HeaderProps {
  cartItemCount: number;
}

export function Header({ cartItemCount }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null); // eslint-disable-line @typescript-eslint/no-explicit-any
  const location = useLocation();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);
  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/shop' },
    { name: 'Collections', path: '/collections' },
    { name: 'About', path: '/about' }
  ];

  const isActive = (path: string) => {
    if (path === '/' && location.pathname !== '/') return false;
    return location.pathname.startsWith(path);
  };


  const isAccountPage = location.pathname.startsWith('/account');
  const headerStyle = isAccountPage ? {
    background: '#0A0A0A',
    boxShadow: 'none',
    color: '#FFFFFF',
    transition: 'background 0.3s ease, color 0.3s ease'
  } : {
    transition: 'background 0.3s ease, color 0.3s ease'
  };

  const textStyle = isAccountPage ? { color: '#FFFFFF' } : {};

  const navWrapperClass = `
  absolute top-full left-0 w-full z-50
  transition-all duration-300
  ${isAccountPage
      ? 'bg-[#0A0A0A] border-t border-white/10'
      : 'bg-[rgb(10 9 0 / 60%)] border-t border-white/10'
    }
`;

  return (
    <header className="header-bar" style={headerStyle}>
      <div className="container flex items-center justify-between">
        {/* Mobile Menu Button */}
        <button
          className="md:hidden menu-toggle-btn"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={24} color={isAccountPage ? 'white' : 'currentColor'} /> : <Menu size={24} color={isAccountPage ? 'white' : 'currentColor'} />}
        </button>

        {/* Logo */}
        <Link to="/" className="logo-text no-underline flex items-center gap-3" style={textStyle}>

          <span>My Super Store</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex gap-12">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`nav-link no-underline ${isActive(item.path) ? 'active' : ''}`}
              style={textStyle}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Icons */}
        <div className="flex items-center gap-6">
          <Link to="/shop" className="icon-btn" style={textStyle}>
            <Search size={24} strokeWidth={2.5} />
          </Link>

          <Link to={user ? "/account" : "/login"} className="icon-btn" style={textStyle}>
            <User size={24} strokeWidth={2.5} />
          </Link>

          <Link to="/cart" className="icon-btn relative" style={textStyle}>
            <ShoppingCart size={24} strokeWidth={2.5} />
            {cartItemCount > 0 && (
              <span className="cart-badge">
                {cartItemCount}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div
          className={navWrapperClass}
          style={{
            background: isAccountPage ? 'rgb(10 9 0 / 60%)' : 'rgb(10 9 0 / 60%)',
            boxShadow: isAccountPage
              ? 'none'
              : '0 10px 24px rgba(0,0,0,0.3)'
          }}
        >
          <nav className="flex flex-col p-6 gap-4">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setIsMenuOpen(false)}
                className={`
          nav-link text-lg py-2 transition-colors
          text-[var(--gold-primary)]
          ${isActive(item.path) ? 'font-semibold' : ''}
        `}
                style={{
                  borderBottom: isActive(item.path)
                    ? '2px solid var(--gold-primary)'
                    : 'none'
                }}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}