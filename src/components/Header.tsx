import { Search, ShoppingCart, User, Menu, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';

interface HeaderProps {
  cartItemCount: number;
}

export function Header({ cartItemCount }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
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

  return (
    <header className="header-bar">
      <div className="container flex items-center justify-between">
        {/* Mobile Menu Button */}
        <button
          className="md:hidden menu-toggle-btn"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Logo */}
        <Link to="/" className="logo-text no-underline flex items-center gap-3">

          <span>My Super Store</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex gap-12">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`nav-link no-underline ${isActive(item.path) ? 'active' : ''}`}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Icons */}
        <div className="flex items-center gap-6">
          <button className="icon-btn">
            <Search size={24} strokeWidth={2.5} />
          </button>

          <Link to="/login" className="icon-btn">
            <User size={24} strokeWidth={2.5} />
          </Link>

          <Link to="/cart" className="icon-btn relative">
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
        <div className="md:hidden absolute top-full left-0 w-full bg-black border-t border-white/10 z-50" style={{ boxShadow: '0 8px 24px rgba(0,0,0,0.3)' }}>
          <nav className="flex flex-col p-6 gap-4">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setIsMenuOpen(false)}
                className={`nav-link text-white text-lg py-2 ${isActive(item.path) ? 'active' : ''}`}
                style={{ borderBottom: isActive(item.path) ? '2px solid var(--gold-primary)' : 'none' }}
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