import { PageId } from '../types/food';
import { ThemeToggle } from './ThemeToggle';

interface FooterProps {
  theme: 'light' | 'dark';
  onToggleTheme: (next: 'light' | 'dark') => void;
  onNavigate: (page: PageId) => void;
}

export function Footer({ theme, onToggleTheme, onNavigate }: FooterProps) {
  const handleNav = (page: PageId) => {
    onNavigate(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-black/[0.08] dark:border-white/[0.10] bg-white dark:bg-[#171A1E] mt-20">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-12 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
        <div>
          <span className="font-display text-lg font-semibold text-[#141517] dark:text-[#F3F4F6]">
            Larder &amp; Table
          </span>
          <p className="text-xs text-[#52565E] dark:text-[#9CA3AF] mt-1.5">
            Four independent neighborhood kitchens · Daily bike delivery 07:30 – 22:30
          </p>
        </div>

        <nav
          aria-label="Footer navigation"
          className="flex flex-wrap items-center gap-6 text-sm text-[#52565E] dark:text-[#9CA3AF]"
        >
          <button
            type="button"
            onClick={() => handleNav('home')}
            className="hover:text-[#141517] dark:hover:text-white transition-colors cursor-pointer"
          >
            Home
          </button>
          <button
            type="button"
            onClick={() => handleNav('menu')}
            className="hover:text-[#141517] dark:hover:text-white transition-colors cursor-pointer"
          >
            Menu
          </button>
          <button
            type="button"
            onClick={() => handleNav('kitchens')}
            className="hover:text-[#141517] dark:hover:text-white transition-colors cursor-pointer"
          >
            Kitchens
          </button>
          <button
            type="button"
            onClick={() => handleNav('orders')}
            className="hover:text-[#141517] dark:hover:text-white transition-colors cursor-pointer"
          >
            Track Order
          </button>
        </nav>

        <div className="flex flex-wrap items-center gap-4">
          <ThemeToggle theme={theme} onToggleTheme={onToggleTheme} />
          <p className="text-xs text-[#737882] dark:text-[#9CA3AF]">
            &copy; {new Date().getFullYear()} Larder &amp; Table Collective
          </p>
        </div>
      </div>
    </footer>
  );
}
