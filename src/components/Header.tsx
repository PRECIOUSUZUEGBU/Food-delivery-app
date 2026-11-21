import { Menu, ShoppingBag, X } from 'lucide-react';
import { useState } from 'react';
import { PageId } from '../types/food';

interface HeaderProps {
  activePage: PageId;
  onNavigate: (page: PageId) => void;
  cartCount: number;
  onOpenCart: () => void;
}

const NAV_ITEMS: { id: PageId; label: string }[] = [
  { id: 'home', label: 'Home' },
  { id: 'menu', label: 'Menu' },
  { id: 'kitchens', label: 'Kitchens' },
  { id: 'orders', label: 'Track Order' },
];

export function Header({
  activePage,
  onNavigate,
  cartCount,
  onOpenCart,
}: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleNavClick = (page: PageId) => {
    onNavigate(page);
    setMobileOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FAFAFA]/95 dark:bg-[#0F1113]/95 backdrop-blur-sm border-b border-black/[0.08] dark:border-white/[0.10]">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Single text element wordmark */}
        <button
          type="button"
          onClick={() => handleNavClick('home')}
          className="font-display text-xl font-semibold tracking-tight text-[#141517] dark:text-[#F3F4F6] whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#164E38] dark:focus-visible:outline-[#5FD39E]"
        >
          Larder &amp; Table
        </button>

        {/* Zone 2: 4 clean single-line text navigation links */}
        <nav
          aria-label="Primary navigation"
          className="hidden md:flex items-center gap-8 text-sm font-medium"
        >
          {NAV_ITEMS.map((item) => {
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavClick(item.id)}
                className={`relative py-1 whitespace-nowrap shrink-0 cursor-pointer transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#164E38] dark:focus-visible:outline-[#5FD39E] ${
                  isActive
                    ? 'text-[#141517] dark:text-white font-semibold'
                    : 'text-[#52565E] dark:text-[#9CA3AF] hover:text-[#141517] dark:hover:text-white'
                }`}
                aria-current={isActive ? 'page' : undefined}
              >
                {item.label}
                <span
                  aria-hidden="true"
                  className={`absolute left-0 right-0 -bottom-[1px] h-[1.5px] bg-[#164E38] dark:bg-[#5FD39E] transition-opacity duration-150 ${
                    isActive ? 'opacity-100' : 'opacity-0'
                  }`}
                />
              </button>
            );
          })}
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={onOpenCart}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-[#164E38] hover:bg-[#113D2B] dark:bg-[#1D6347] dark:hover:bg-[#164E38] rounded-lg transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer min-h-[40px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#164E38] dark:focus-visible:outline-[#5FD39E]"
          >
            <ShoppingBag className="w-4 h-4" strokeWidth={1.75} />
            <span>Bag</span>
            <span className="tabular-nums font-mono text-[11px] bg-white/15 px-1.5 py-0.5 rounded">
              {cartCount}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            className="md:hidden inline-flex items-center justify-center w-11 h-11 rounded-lg border border-black/[0.08] dark:border-white/[0.12] text-[#141517] dark:text-[#F3F4F6] hover:bg-black/[0.04] dark:hover:bg-white/[0.06] cursor-pointer focus-visible:outline-2 focus-visible:outline-[#164E38]"
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile navigation drawer */}
      {mobileOpen && (
        <nav
          aria-label="Mobile navigation"
          className="md:hidden border-t border-black/[0.08] dark:border-white/[0.10] bg-[#FAFAFA] dark:bg-[#0F1113] px-4 py-3 flex flex-col gap-1"
        >
          {NAV_ITEMS.map((item) => {
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavClick(item.id)}
                className={`w-full text-left px-3 py-3 rounded-lg text-sm font-medium transition-colors whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-[#164E38]/10 dark:bg-[#1D6347]/25 text-[#164E38] dark:text-[#5FD39E] font-semibold'
                    : 'text-[#52565E] dark:text-[#9CA3AF] hover:bg-black/[0.04] dark:hover:bg-white/[0.06] hover:text-[#141517] dark:hover:text-white'
                }`}
                aria-current={isActive ? 'page' : undefined}
              >
                {item.label}
              </button>
            );
          })}
        </nav>
      )}
    </header>
  );
}
