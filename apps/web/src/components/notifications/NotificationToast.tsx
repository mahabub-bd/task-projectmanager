import { useMarkAsReadMutation } from '@/store/api';
import { Notification } from '@/store/api/notificationsApi';
import { AlertTriangle, CheckSquare, Info, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface NotificationToastProps {
  notification: Notification;
  onClose: () => void;
}

export function NotificationToast({ notification, onClose }: NotificationToastProps) {
  const [markAsRead] = useMarkAsReadMutation();
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    // Animate in
    setTimeout(() => setIsVisible(true), 10);

    // Auto-dismiss after 5 seconds for low priority, 8 seconds for medium, never for high/urgent
    const duration =
      notification.priority === 'low' ? 5000 :
      notification.priority === 'medium' ? 8000 :
      null;

    if (duration) {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [notification.priority]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  const handleClick = () => {
    // Mark as read
    markAsRead(notification.id);

    // Navigate if there's an action URL
    if (notification.action_url) {
      navigate(notification.action_url);
    }

    handleClose();
  };

  const getIcon = () => {
    switch (notification.priority) {
      case 'urgent':
      case 'high':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case 'medium':
        return <Info className="h-5 w-5 text-blue-500" />;
      case 'low':
      default:
        return <CheckSquare className="h-5 w-5 text-gray-500" />;
    }
  };

  const getPriorityColor = () => {
    switch (notification.priority) {
      case 'urgent':
        return 'border-l-red-500 bg-red-50 dark:bg-red-900/20';
      case 'high':
        return 'border-l-orange-500 bg-orange-50 dark:bg-orange-900/20';
      case 'medium':
        return 'border-l-blue-500 bg-blue-50 dark:bg-blue-900/20';
      case 'low':
      default:
        return 'border-l-gray-500 bg-gray-50 dark:bg-gray-900/20';
    }
  };

  return (
    <div
      className={`
        fixed top-4 right-4 z-50 max-w-md w-full
        border-l-4 shadow-lg rounded-lg
        transition-all duration-300 ease-in-out
        ${getPriorityColor()}
        ${isVisible && !isClosing ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
        ${isClosing ? 'translate-x-full opacity-0' : ''}
      `}
    >
      <div className="flex items-start p-4">
        <div className="shrink-0">{getIcon()}</div>

        <div className="ml-3 flex-1">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
              {notification.title}
            </p>
            <button
              onClick={handleClose}
              className="ml-3 inline-flex text-gray-400 hover:text-gray-500 focus:outline-none"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
            {notification.message}
          </p>

          {notification.action_url && (
            <button
              onClick={handleClick}
              className="mt-2 text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400"
            >
              View Details →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
