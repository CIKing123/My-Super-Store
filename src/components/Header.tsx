import { Search, ShoppingCart, User, Menu, X, Gem } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface HeaderProps {
  cartItemCount: number;
}

export function Header({ cartItemCount }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null); // eslint-disable-line @typescript-eslint/no-explicit-any
  const location = useLocation();
  const navigate = useNavigate();

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
    { name: 'About', path: '/about' },
    { name: 'Login', path: '/login' }
  ];

  const isAccountPage = location.pathname.startsWith('/account');

  // Header styling based on page
  const headerClass = isAccountPage
    ? 'sticky top-0 z-50 w-full bg-[#0A0A0A] border-b border-white/10'
    : 'sticky top-0 z-50 w-full bg-white/90 backdrop-blur-md border-b border-[#f0f0f0]';

  const textColorClass = isAccountPage ? 'text-white' : 'text-slate-900';
  const textMutedClass = isAccountPage ? 'text-white/60' : 'text-slate-900/70';
  const hoverBgClass = isAccountPage ? 'hover:bg-white/10' : 'hover:bg-slate-100';
  const linkHoverClass = isAccountPage ? 'hover:text-white' : 'hover:text-black';
  const menuBgClass = isAccountPage ? 'bg-[#0A0A0A] border-t border-white/10' : 'bg-white/95';

  return (
    <header className={headerClass}>
      <div className="flex justify-center w-full">
        <div className="flex w-full max-w-[1280px] items-center px-4 sm:px-6 md:px-8 lg:px-10 py-5 gap-4 sm:gap-6 md:gap-8">
          {/* Logo Area - Left */}
          <Link to="/" className="flex items-center gap-2 cursor-pointer no-underline flex-shrink-0">
            <div className={`flex items-center justify-center size-8 rounded-full transition-colors ${
              isAccountPage ? 'bg-white/10' : 'bg-black'
            }`}>
              <Gem size={20} strokeWidth={2} className={isAccountPage ? 'text-white' : 'text-white'} />
            </div>
            <h2 className={`${textColorClass} text-lg sm:text-xl font-extrabold tracking-tight transition-colors whitespace-nowrap`}>My Super Store</h2>
          </Link>

          {/* Desktop Nav Links - Between Logo and Icons */}
          <nav style={{ display: window.innerWidth >= 768 ? 'flex' : 'none', gap: '24px', marginLeft: '48px' }} className="items-center">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`${textMutedClass} ${linkHoverClass} transition-colors text-sm font-semibold tracking-wide no-underline`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Icons / Actions - Right */}
          <div className="flex items-center gap-3 sm:gap-4 md:gap-5 ml-auto">
            <button 
              onClick={() => navigate('/shop')}
              className={` sm:flex items-center justify-center size-10 rounded-full ${hoverBgClass} transition-colors ${textColorClass}`}
            >
              <Search size={20} strokeWidth={2} />
            </button>
            <button 
              onClick={() => navigate(user ? '/account' : '/login')}
              className={`flex items-center justify-center size-10 rounded-full ${hoverBgClass} transition-colors ${textColorClass}`}
            >
              <User size={20} strokeWidth={2} />
            </button>
            <button 
              onClick={() => navigate('/cart')}
              className={`flex items-center justify-center size-10 rounded-full ${hoverBgClass} transition-colors ${textColorClass} relative`}
            >
              <ShoppingCart size={20} strokeWidth={2} />
              {cartItemCount > 0 && (
                <span className="absolute top-2 right-2 size-2 bg-[#d4af37] rounded-full"></span>
              )}
            </button>
          </div>

          {/* Mobile Menu Button - Only on Mobile */}
          <button
            className=" md:hidden items-center justify-center ml-2 sm:ml-3"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? 
              <X size={24} className={textColorClass} /> : 
              <Menu size={24} className={textColorClass} />
            }
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className={menuBgClass}>
          <nav className="flex justify-center w-full">
            <div className="w-full max-w-[1280px] flex flex-col p-6 gap-4 px-6 lg:px-10">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`${textColorClass} ${linkHoverClass} text-lg py-2 transition-colors font-semibold no-underline`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
