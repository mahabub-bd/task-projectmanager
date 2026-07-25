interface TaskDescriptionProps {
  description: string | null | undefined;
}

export default function TaskDescription({ description }: TaskDescriptionProps) {
  return (
    <div className="rounded-lg border bg-card p-6">
      <h3 className="font-semibold mb-3">Description</h3>
      <p className="text-sm whitespace-pre-wrap text-muted-foreground">
        {description || 'No description provided.'}
      </p>
    </div>
  );
}
