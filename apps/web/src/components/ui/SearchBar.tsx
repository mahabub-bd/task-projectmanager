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
      <div className={`flex flex-row justify-between items-stretch sm:items-center gap-2 ${className}`}>
        <div className="relative flex-1 w-full min-w-0">
          <Search className="absolute left-2.5 sm:left-3 top-1/2 h-3.5 sm:h-4 w-3.5 sm:w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="pl-8 sm:pl-10 h-9 sm:h-10 text-xs sm:text-sm"
          />
        </div>
        <Button onClick={button.onClick} size="sm" className="sm:size-default shrink-0 h-9 sm:h-10 text-xs sm:text-sm whitespace-nowrap">
          {button.icon && <button.icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />}
          <span className="hidden xs:inline">{button.label}</span>
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
