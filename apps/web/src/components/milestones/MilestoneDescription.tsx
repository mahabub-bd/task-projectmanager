import { Card, CardContent } from '@/components/ui/card';
import { FileText } from 'lucide-react';

interface MilestoneDescriptionProps {
  description: string | null | undefined;
}

export default function MilestoneDescription({ description }: MilestoneDescriptionProps) {
  if (!description) {
    return null;
  }

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="rounded-lg bg-primary/10 p-2">
            <FileText className="h-4 w-4 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold mb-2">Description</h3>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">
              {description}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
