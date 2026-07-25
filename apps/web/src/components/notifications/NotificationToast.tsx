import { useEffect, useState } from 'react';
import { X, Check, AlertTriangle, Info, AlertCircle } from 'lucide-react';
import { useNotificationsSocket } from '@/hooks/useNotificationsSocket';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const priorityConfig = {
  low: {
    icon: Info,
    bgColor: 'bg-blue-500',
    textColor: 'text-blue-600',
    lightBg: 'bg-blue-50 dark:bg-blue-950',
  },
  medium: {
    icon: Check,
    bgColor: 'bg-green-500',
    textColor: 'text-green-600',
    lightBg: 'bg-green-50 dark:bg-green-950',
  },
  high: {
    icon: AlertTriangle,
    bgColor: 'bg-orange-500',
    textColor: 'text-orange-600',
    lightBg: 'bg-orange-50 dark:bg-orange-950',
  },
  urgent: {
    icon: AlertCircle,
    bgColor: 'bg-red-500',
    textColor: 'text-red-600',
    lightBg: 'bg-red-50 dark:bg-red-950',
  },
};

export default function NotificationToast() {
  const { latestNotification } = useNotificationsSocket();
  const [visibleToasts, setVisibleToasts] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (latestNotification) {
      // Add new toast
      const toastId = latestNotification.id;
      setVisibleToasts((prev) => [
        ...prev,
        { ...latestNotification, toastId },
      ]);

      // Auto-remove after 5 seconds
      const timer = setTimeout(() => {
        removeToast(toastId);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [latestNotification]);

  const removeToast = (id: number) => {
    setVisibleToasts((prev) => prev.filter((t) => t.toastId !== id));
  };

  const handleClick = (toast: any) => {
    if (toast.action_url) {
      navigate(toast.action_url);
    }
    removeToast(toast.toastId);
  };

  if (visibleToasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
      <AnimatePresence>
        {visibleToasts.map((toast) => {
          const config = priorityConfig[toast.priority as keyof typeof priorityConfig] || priorityConfig.medium;
          const Icon = config.icon;

          return (
            <motion.div
              key={toast.toastId}
              initial={{ opacity: 0, x: 300, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 300, scale: 0.9 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="pointer-events-auto"
            >
              <div
                className={`${config.lightBg} border rounded-lg shadow-lg p-4 min-w-[320px] max-w-[400px] cursor-pointer hover:shadow-xl transition-shadow`}
                onClick={() => handleClick(toast)}
              >
                <div className="flex items-start gap-3">
                  <div className={`${config.bgColor} p-2 rounded-full flex-shrink-0`}>
                    <Icon className="h-4 w-4 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-foreground">
                      {toast.title}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                      {toast.message}
                    </p>
                    {toast.action_url && (
                      <p className="text-xs text-primary mt-2">
                        Click to view →
                      </p>
                    )}
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeToast(toast.toastId);
                    }}
                    className="flex-shrink-0 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
