import { AnimatePresence, motion } from 'motion/react';
import { Check, X } from 'lucide-react';

interface ToastBannerProps {
  message: string | null;
  actionLabel?: string;
  onAction?: () => void;
  onDismiss: () => void;
}

export function ToastBanner({
  message,
  actionLabel,
  onAction,
  onDismiss,
}: ToastBannerProps) {
  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 12 }}
          transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
          className="fixed bottom-5 right-5 z-50 max-w-sm bg-[#141517] dark:bg-[#1F2329] text-white rounded-xl shadow-xl border border-white/10 dark:border-white/15 px-4 py-3 flex items-center gap-3"
          role="status"
          aria-live="polite"
        >
          <div className="w-6 h-6 rounded-full bg-[#164E38] dark:bg-[#1D6347] flex items-center justify-center shrink-0">
            <Check className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />
          </div>
          <p className="text-xs font-medium text-white/95 flex-1 leading-snug">
            {message}
          </p>
          {actionLabel && onAction && (
            <button
              type="button"
              onClick={onAction}
              className="text-xs font-semibold text-[#86EFAC] hover:text-white whitespace-nowrap shrink-0 cursor-pointer px-1.5 py-1"
            >
              {actionLabel}
            </button>
          )}
          <button
            type="button"
            onClick={onDismiss}
            aria-label="Dismiss notification"
            className="text-white/60 hover:text-white p-1 cursor-pointer shrink-0"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
