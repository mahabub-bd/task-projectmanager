interface ProjectProgressBarProps {
  progress: number;
}

export default function ProjectProgressBar({ progress }: ProjectProgressBarProps) {
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - ((progress || 0) / 100) * circumference;

  // Determine color based on progress
  const getProgressColor = () => {
    const p = progress || 0;
    if (p < 25) return '#ef4444'; // red-500
    if (p < 50) return '#f59e0b'; // amber-500
    if (p < 75) return '#3b82f6'; // blue-500
    return '#22c55e'; // green-500
  };

  const progressColor = getProgressColor();

  return (
    <div className="rounded-lg border bg-card p-6">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h3 className="text-lg font-semibold mb-1">Project Progress</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Track your project completion status
          </p>

          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Status</span>
              <span className={`font-semibold ${
                (progress || 0) === 100 ? 'text-green-600' : 'text-muted-foreground'
              }`}>
                {(progress || 0) === 100 ? 'Completed' : 'In Progress'}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Completed</span>
              <span className="font-semibold">{progress || 0}%</span>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: progressColor }} />
              <span>
                {(progress || 0) < 25 && 'Needs attention'}
                {(progress || 0) >= 25 && (progress || 0) < 50 && 'In early stages'}
                {(progress || 0) >= 50 && (progress || 0) < 75 && 'Making good progress'}
                {(progress || 0) >= 75 && (progress || 0) < 100 && 'Almost there'}
                {(progress || 0) === 100 && 'Fully completed'}
              </span>
            </div>
          </div>
        </div>

        <div className="shrink-0 ml-6">
          <div className="relative">
            {/* Background circle */}
            <svg className="transform -rotate-90 w-40 h-40">
              <circle
                cx="80"
                cy="80"
                r={radius}
                stroke="hsl(var(--muted))"
                strokeWidth="12"
                fill="none"
              />
              {/* Progress circle */}
              <circle
                cx="80"
                cy="80"
                r={radius}
                stroke={progressColor}
                strokeWidth="12"
                fill="none"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                strokeLinecap="round"
                className="transition-all duration-500 ease-out"
                style={{
                  filter: 'drop-shadow(0 0 4px rgba(0,0,0,0.1))'
                }}
              />
            </svg>

            {/* Center text */}
            <div className="absolute inset-0 flex items-center justify-center flex-col">
              <span className="text-3xl font-bold" style={{ color: progressColor }}>
                {progress || 0}
              </span>
              <span className="text-xs text-muted-foreground">%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
