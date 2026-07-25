interface TaskProgressBarProps {
  progress: number;
}

export default function TaskProgressBar({ progress }: TaskProgressBarProps) {
  return (
    <div className="rounded-lg border bg-card p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium">Progress</span>
        <span className="text-sm font-semibold">{progress || 0}%</span>
      </div>
      <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
        <div className="bg-primary h-full transition-all" style={{ width: `${progress || 0}%` }} />
      </div>
    </div>
  );
}
