import { format } from 'date-fns';
import { useAppSelector } from '../../store/hooks';

interface WelcomeHeaderProps {
  className?: string;
}

export default function WelcomeHeader({ className }: WelcomeHeaderProps) {
  const { user } = useAppSelector((state) => state.auth);
  const now = new Date();

  return (
    <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 ${className}`}>
      <div className="space-y-0.5 sm:space-y-1">
        <h1 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold tracking-tight">
          Welcome back, <span className="text-primary">{user?.name?.split(' ')[0]}</span>!
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Here's what's happening with your projects today
        </p>
      </div>

      <div className="flex flex-row sm:flex-col sm:items-end gap-2 sm:gap-1 text-xs sm:text-sm">
        <p className="font-medium truncate max-w-40 sm:max-w-none">{format(now, 'EEEE, MMM d, yyyy')}</p>
        <p className="text-muted-foreground">{format(now, 'h:mm a')}</p>
      </div>
    </div>
  );
}
