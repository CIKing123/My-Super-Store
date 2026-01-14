import { Search, ShoppingCart, User, Menu, X, Gem, ChevronDown } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface HeaderProps {
  cartItemCount: number;
}

export function Header({ cartItemCount }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isShopDropdownOpen, setIsShopDropdownOpen] = useState(false);
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

  const shopCategories = [
    { label: 'All Products', value: 'All' },
    { label: 'Cosmetics', value: 'Cosmetics' },
    { label: 'Construction', value: 'Construction' },
    { label: 'Furniture', value: 'Furniture' },
    { label: 'Clothing and Fashion', value: 'Clothing and Fashion' },
    { label: 'Events Tools', value: 'Events Tools' },
    { label: 'Electrical Appliances', value: 'Electrical Appliances' }
  ];

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Login', path: '/login' }
  ];


  const isAccountPage = location.pathname.startsWith('/account');

  // Header styling based on page
  const headerClass = isAccountPage
    ? 'sticky top-0 z-50 w-full bg-[#0A0A0A] border-b border-white/10'
    : 'sticky top-0 z-50 w-full bg-white/30 backdrop-blur-md border-b border-[#f0f0f0]';

  const textColorClass = isAccountPage ? 'text-white' : 'text-slate-900';
  const textMutedClass = isAccountPage ? 'text-white/60' : 'text-slate-900/70';
  const hoverBgClass = isAccountPage ? 'hover:bg-white/10' : 'hover:bg-slate-100';
  const linkHoverClass = isAccountPage ? 'hover:text-white' : 'hover:text-black';
  const menuBgClass = isAccountPage ? 'bg-[#0A0A0A] border-t border-white/10' : 'bg-white/20';

  return (
    <header className={headerClass}>
      <div className="flex justify-center w-full">
        <div className="flex justify-between w-full max-w-[1280px] items-center px-4 sm:px-6 md:px-8 lg:px-10 py-5 gap-4 sm:gap-6 md:gap-8">
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
          <nav style={{ display: window.innerWidth >= 768 ? 'flex' : 'none', gap: '24px', marginLeft: '48px' }} className="items-center relative">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`transition-all text-sm font-semibold tracking-wide no-underline ${
                  isAccountPage 
                    ? 'text-white 70 drop-shadow-[0_0_8px_rgba(255,255,255,0.5)] hover:text-white hover:drop-shadow-[0_0_16px_rgba(255,255,255,0.8)]' 
                    : `${textMutedClass} ${linkHoverClass} text-slate-900 drop-shadow-[0_0_8px_rgba(15,23,42,0.3)] hover:drop-shadow-[0_0_16px_rgba(15,23,42,0.6)]`
                }`}
              >
                {item.name}
              </Link>
            ))}
            
            {/* Shop Dropdown */}
            <div 
              className="relative group"
              onMouseEnter={() => setIsShopDropdownOpen(true)}
              onMouseLeave={() => setIsShopDropdownOpen(false)}
            >
              <button className={`flex items-center gap-1 ${textMutedClass} ${linkHoverClass} transition-colors text-sm font-semibold tracking-wide`}>
                Shop
                <ChevronDown size={16} className={`transition-transform duration-300 ${isShopDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {/* Dropdown Menu */}
              {isShopDropdownOpen && (
                <div className={`absolute top-full left-0 mt-2 w-56 rounded-lg shadow-lg z-50 backdrop-blur-md ${
                  isAccountPage 
                    ? 'bg-[#0A0A0A]/80 border border-white/10' 
                    : 'bg-white/30 border border-white/20'
                }`}>
                  {shopCategories.map((category) => (
                    <button
                      key={category.value}
                      onClick={() => {
                        navigate(`/shop?category=${category.value}`);
                        setIsShopDropdownOpen(false);
                      }}
                      className={`w-full text-left px-4 py-3 transition-all ${
                        isAccountPage 
                          ? 'text-white/70 hover:text-white hover:bg-white/10 first:rounded-t-lg last:rounded-b-lg' 
                          : 'text-slate-900/20 hover:text-slate-900 hover:bg-slate-100/20 first:rounded-t-lg last:rounded-b-lg'
                      } text-sm font-medium`}
                    >
                      {category.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </nav>

          {/* Icons / Actions - Right */}
          <div className="flex items-center gap-3 sm:gap-4 md:gap-5 ml-auto">
 
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
              
              {/* Mobile Shop Categories */}
              <div className="border-t border-white/10 pt-4 mt-4">
                <p className={`${textColorClass} text-sm font-semibold mb-3`}>Shop by Category</p>
                {shopCategories.map((category) => (
                  <button
                    key={category.value}
                    onClick={() => {
                      navigate(`/shop?category=${category.value}`);
                      setIsMenuOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 ${textMutedClass} ${linkHoverClass} transition-colors text-sm font-medium no-underline`}
                  >
                    {category.label}
                  </button>
                ))}
              </div>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
