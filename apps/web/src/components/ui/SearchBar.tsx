import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LucideIcon, Search } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  button?: {
    icon?: LucideIcon;
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export default function SearchBar({
  value,
  onChange,
  placeholder,
  button,
  className = '',
}: SearchBarProps) {
  if (button) {
    // Layout with button included (like UsersPage)
    return (
      <div className={`flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 ${className}`}>
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="pl-10 h-10"
          />
        </div>
        <Button onClick={button.onClick} size="default" className="w-full sm:w-auto">
          {button.icon && <button.icon className="h-4 w-4" />}
          {button.label}
        </Button>
      </div>
    );
  }

  // Standalone search bar
  return (
    <div className={`relative ${className}`}>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-10"
      />
    </div>
  );
}
