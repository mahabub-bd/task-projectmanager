import { format } from 'date-fns';
import { useAppSelector } from '../../store/hooks';

interface WelcomeHeaderProps {
  className?: string;
}

export default function WelcomeHeader({ className }: WelcomeHeaderProps) {
  const { user } = useAppSelector((state) => state.auth);
  const now = new Date();

  return (
    <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 ${className}`}>
      <div className="space-y-1">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
          Welcome back, <span className="text-primary">{user?.name?.split(' ')[0]}</span>!
        </h1>
        <p className="text-muted-foreground">
          Here's what's happening with your projects today
        </p>
      </div>

      <div className="flex flex-col sm:items-end gap-1 text-sm">
        <p className="font-medium">{format(now, 'EEEE, MMMM d, yyyy')}</p>
        <p className="text-muted-foreground">{format(now, 'h:mm a')}</p>
      </div>
    </div>
  );
}
