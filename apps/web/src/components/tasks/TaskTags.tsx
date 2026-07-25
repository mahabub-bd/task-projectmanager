import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tag as TagIcon, X } from 'lucide-react';

interface TaskTagsProps {
  taskTags: any[];
  newTag: string;
  showTagInput: boolean;
  setNewTag: React.Dispatch<React.SetStateAction<string>>;
  setShowTagInput: React.Dispatch<React.SetStateAction<boolean>>;
  onAddTag: () => void;
  onRemoveTag: (tagId: number) => void;
}

export const getTagTextColor = (backgroundColor?: string | null) => {
  if (!backgroundColor || !backgroundColor.startsWith('#')) {
    return '#374151';
  }

  const hex = backgroundColor.replace('#', '');
  const normalizedHex = hex.length === 3
    ? hex.split('').map((char) => char + char).join('')
    : hex;

  if (normalizedHex.length !== 6) {
    return '#374151';
  }

  const red = parseInt(normalizedHex.slice(0, 2), 16);
  const green = parseInt(normalizedHex.slice(2, 4), 16);
  const blue = parseInt(normalizedHex.slice(4, 6), 16);
  const brightness = (red * 299 + green * 587 + blue * 114) / 1000;

  return brightness > 150 ? '#111827' : '#f9fafb';
};

export default function TaskTags({
  taskTags,
  newTag,
  showTagInput,
  setNewTag,
  setShowTagInput,
  onAddTag,
  onRemoveTag,
}: TaskTagsProps) {
  return (
    <div className="rounded-lg border bg-card px-6 py-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <TagIcon className="h-4 w-4" />
          <h3 className="font-semibold">Tags</h3>
        </div>
        <Button variant="outline" size="sm" onClick={() => setShowTagInput(!showTagInput)}>
          {showTagInput ? 'Cancel' : 'Add Tag'}
        </Button>
      </div>

      {showTagInput && (
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                onAddTag();
              }
            }}
            placeholder="Enter tag name..."
            className="flex-1 px-3 py-2 rounded-md border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <Button onClick={onAddTag} size="sm">
            Add
          </Button>
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        {taskTags.length > 0 ? (
          taskTags.map((tag: any) => (
            <Badge
              key={tag.id}
              variant="secondary"
              className="gap-1 px-2 py-1 text-base"
              style={{
                backgroundColor: tag.color || '#e5e7eb',
                color: getTagTextColor(tag.color),
              }}
            >
              {tag.name}
              <button
                onClick={() => onRemoveTag(tag.id)}
                className="ml-1 hover:bg-black/10 rounded-full p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))
        ) : (
          <p className="text-sm text-muted-foreground">No tags yet. Add tags to organize this task.</p>
        )}
      </div>
    </div>
  );
}
