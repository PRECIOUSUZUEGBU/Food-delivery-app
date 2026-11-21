import { Moon, Sun } from 'lucide-react';

interface ThemeToggleProps {
  theme: 'light' | 'dark';
  onToggleTheme: (next: 'light' | 'dark') => void;
}

export function ThemeToggle({ theme, onToggleTheme }: ThemeToggleProps) {
  return (
    <div
      role="group"
      aria-label="Color theme"
      className="inline-flex items-center gap-1 p-1 rounded-lg bg-[#EFEFEF] dark:bg-[#1F2329] border border-black/[0.06] dark:border-white/[0.08] shrink-0"
    >
      <button
        type="button"
        onClick={() => onToggleTheme('light')}
        aria-pressed={theme === 'light'}
        className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer min-h-[32px] ${
          theme === 'light'
            ? 'bg-white text-[#141517] shadow-xs'
            : 'text-[#52565E] dark:text-[#9CA3AF] hover:text-[#141517] dark:hover:text-[#F3F4F6]'
        }`}
      >
        <Sun className="w-3.5 h-3.5" />
        <span>Light</span>
      </button>

      <button
        type="button"
        onClick={() => onToggleTheme('dark')}
        aria-pressed={theme === 'dark'}
        className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer min-h-[32px] ${
          theme === 'dark'
            ? 'bg-[#171A1E] text-[#F3F4F6] shadow-xs border border-white/[0.08]'
            : 'text-[#52565E] dark:text-[#9CA3AF] hover:text-[#141517] dark:hover:text-[#F3F4F6]'
        }`}
      >
        <Moon className="w-3.5 h-3.5" />
        <span>Dark</span>
      </button>
    </div>
  );
}
