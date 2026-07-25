import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';

interface PageErrorStateProps {
  title: string;
  description?: string;
  onRetry?: () => void;
  retryLabel?: string;
}

export default function PageErrorState({
  title,
  description,
  onRetry,
  retryLabel = 'Try again',
}: PageErrorStateProps) {
  return (
    <Card>
      <CardContent className="p-12 text-center">
        <AlertCircle className="mx-auto mb-4 h-14 w-14 text-red-500" />
        <h2 className="mb-2 text-xl font-semibold">{title}</h2>
        {description && <p className="mb-6 text-muted-foreground">{description}</p>}
        {onRetry && <Button onClick={onRetry}>{retryLabel}</Button>}
      </CardContent>
    </Card>
  );
}
