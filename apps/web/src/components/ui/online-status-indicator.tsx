import { useGetOnlineUsersQuery } from '@/store/api';
import { useEffect, useState } from 'react';

interface OnlineStatusIndicatorProps {
  userId: number;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export function OnlineStatusIndicator({ userId, size = 'md', showText = false }: OnlineStatusIndicatorProps) {
  // Pass undefined as the argument
  const { data: onlineUsers = [] } = useGetOnlineUsersQuery(undefined);
  const [isOnline, setIsOnline] = useState(false);

  useEffect(() => {
    console.log('Online users data:', onlineUsers);
    console.log('Checking if user', userId, 'is online');

    // Check if user is online from the API data
    const online = onlineUsers.some((user: any) => user.id === userId);
    console.log('User', userId, 'online status:', online);
    setIsOnline(online);

    // Listen for online/offline events
    const handleUserOnline = (event: Event) => {
      const customEvent = event as CustomEvent;
      console.log('User online event:', customEvent.detail);
      if (customEvent.detail.userId === userId) {
        setIsOnline(true);
      }
    };

    const handleUserOffline = (event: Event) => {
      const customEvent = event as CustomEvent;
      console.log('User offline event:', customEvent.detail);
      if (customEvent.detail.userId === userId) {
        setIsOnline(false);
      }
    };

    window.addEventListener('user-online', handleUserOnline);
    window.addEventListener('user-offline', handleUserOffline);

    return () => {
      window.removeEventListener('user-online', handleUserOnline);
      window.removeEventListener('user-offline', handleUserOffline);
    };
  }, [onlineUsers, userId]);

  const sizeClasses = {
    sm: 'h-2 w-2',
    md: 'h-3 w-3',
    lg: 'h-4 w-4',
  };

  const positionClasses = {
    sm: '-bottom-0 -right-0',
    md: '-bottom-0.5 -right-0.5',
    lg: '-bottom-1 -right-1',
  };

  if (!isOnline) {
    return null;
  }

  return (
    <>
      <div
        className={`absolute ${positionClasses[size]} ${sizeClasses[size]} rounded-full border-2 border-background bg-green-500`}
        title="Online"
      />
      {showText && (
        <span className="text-xs text-green-600 dark:text-green-400 ml-2">Online</span>
      )}
    </>
  );
}

export default OnlineStatusIndicator;
