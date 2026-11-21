import { useState } from 'react';
import { Utensils } from 'lucide-react';

interface ResilientImageProps {
  src: string;
  alt: string;
  className?: string;
}

export function ResilientImage({ src, alt, className = '' }: ResilientImageProps) {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-[#EFEFEF] dark:bg-[#1F2329] text-[#52565E] dark:text-[#9CA3AF] p-6 text-center ${className}`}
        role="img"
        aria-label={alt}
      >
        <Utensils
          className="w-7 h-7 mb-2 text-[#164E38]/70 dark:text-[#5FD39E]/80"
          strokeWidth={1.5}
        />
        <span className="text-xs font-medium tracking-wide text-[#52565E] dark:text-[#9CA3AF] line-clamp-2 max-w-[18ch]">
          {alt}
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
      className={className}
    />
  );
}
