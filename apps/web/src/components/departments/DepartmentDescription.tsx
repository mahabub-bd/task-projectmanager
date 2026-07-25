import { Card, CardContent } from '@/components/ui/card';

interface DepartmentDescriptionProps {
  description?: string | null;
}

export default function DepartmentDescription({ description }: DepartmentDescriptionProps) {
  if (!description) {
    return null;
  }

  return (
    <Card className="border-2">
      <CardContent className="p-6">
        <h3 className="font-semibold mb-3">About this Department</h3>
        <p className="text-sm text-muted-foreground whitespace-pre-wrap">{description}</p>
      </CardContent>
    </Card>
  );
}
