import { Card, CardContent } from '@/components/ui/card';

interface PageLoadingStateProps {
  message: string;
}

export default function PageLoadingState({ message }: PageLoadingStateProps) {
  return (
    <Card>
      <CardContent className="p-12">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-muted-foreground">{message}</p>
        </div>
      </CardContent>
    </Card>
  );
}
