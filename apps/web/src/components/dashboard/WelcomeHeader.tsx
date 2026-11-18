import { Button } from '@/components/ui/button';
import { useAppSelector } from '../../store/hooks';
import { CalendarDays, ListTodo, Plus } from 'lucide-react';
import { format } from 'date-fns';

interface WelcomeHeaderProps {
  onNavigate: (path: string) => void;
}

const getGreeting = (hour: number) => {
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
};

export default function WelcomeHeader({ onNavigate }: WelcomeHeaderProps) {
  const { user } = useAppSelector((state) => state.auth);
  const now = new Date();
  const firstName = user?.name?.split(' ')[0] || 'there';

  return (
    <header className="dashboard-enter flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
      <div className="min-w-0 space-y-3">
        <span className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
          <CalendarDays className="h-3 w-3" />
          {format(now, 'EEEE, MMM d, yyyy')}
        </span>

        <div>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            {getGreeting(now.getHours())}, <span className="text-primary">{firstName}</span>
          </h1>
          <p className="mt-1.5 max-w-xl text-sm text-muted-foreground">
            Here's a clear view of your projects, tasks, and team today.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Button variant="outline" onClick={() => onNavigate('/tasks')} className="gap-2">
          <ListTodo className="h-4 w-4" />
          View tasks
        </Button>
        <Button onClick={() => onNavigate('/projects')} className="gap-2 shadow-sm">
          <Plus className="h-4 w-4" />
          New project
        </Button>
      </div>
    </header>
  );
}
