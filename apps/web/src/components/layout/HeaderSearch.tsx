import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { CornerDownLeft, Search } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { KeyboardEvent as ReactKeyboardEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFilteredNavigation } from './use-filtered-navigation';

interface HeaderSearchProps {
  iconOnly?: boolean;
  className?: string;
  enableShortcut?: boolean;
}

const isMac =
  typeof navigator !== 'undefined' && /Mac|iPhone|iPad|iPod/.test(navigator.platform);
const shortcutLabel = isMac ? '⌘K' : 'Ctrl K';

export function HeaderSearch({ iconOnly = false, className, enableShortcut = true }: HeaderSearchProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const navigation = useFilteredNavigation();

  const results = useMemo(() => {
    const items = navigation.flatMap((group) =>
      group.items.map((item) => ({ ...item, group: group.title }))
    );
    const normalizedQuery = query.trim().toLowerCase();

    const filtered = normalizedQuery
      ? items.filter(
          (item) =>
            item.name.toLowerCase().includes(normalizedQuery) ||
            item.group.toLowerCase().includes(normalizedQuery)
        )
      : items;

    return filtered.slice(0, 8);
  }, [navigation, query]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  useEffect(() => {
    if (!enableShortcut) return;

    const handleShortcut = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setOpen((previous) => !previous);
      }
    };

    window.addEventListener('keydown', handleShortcut);
    return () => window.removeEventListener('keydown', handleShortcut);
  }, [enableShortcut]);

  const goTo = (path: string) => {
    setOpen(false);
    navigate(path);
  };

  const handleInputKeyDown = (event: ReactKeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActiveIndex((index) => Math.min(index + 1, results.length - 1));
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActiveIndex((index) => Math.max(index - 1, 0));
    } else if (event.key === 'Enter') {
      const selected = results[activeIndex];
      if (selected) goTo(selected.href);
    }
  };

  const triggerClassName = iconOnly
    ? 'grid h-8 w-8 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-accent/70 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
    : 'hidden h-9 w-full max-w-[20rem] items-center gap-2.5 rounded-xl border border-border/70 bg-background/60 px-3 text-sm transition-colors hover:border-primary/40 hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring lg:flex';

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        title={`Search pages (${shortcutLabel})`}
        aria-label="Search pages"
        className={cn(triggerClassName, className)}
      >
        <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
        {!iconOnly && (
          <>
            <span className="flex-1 text-left text-muted-foreground">Search pages...</span>
            <kbd className="rounded-md border border-border/70 bg-muted/60 px-1.5 py-0.5 font-sans text-[10px] font-medium text-muted-foreground">
              {shortcutLabel}
            </kbd>
          </>
        )}
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          className="max-w-xl gap-0 overflow-hidden p-0 sm:rounded-2xl"
          onOpenAutoFocus={(event) => {
            event.preventDefault();
            inputRef.current?.focus();
          }}
        >
          <DialogTitle className="sr-only">Search pages</DialogTitle>

          <div className="flex items-center gap-3 border-b border-border/70 py-0 pl-4 pr-12">
            <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
            <input
              ref={inputRef}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onKeyDown={handleInputKeyDown}
              placeholder="Search pages, workspaces, settings..."
              className="h-12 min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
          </div>

          <div className="dashboard-scroll max-h-[min(60vh,22rem)] overflow-y-auto p-2">
            {results.length === 0 ? (
              <div className="py-12 text-center">
                <p className="text-sm font-medium">No pages found</p>
                <p className="mt-1 text-xs text-muted-foreground">Try a different search term.</p>
              </div>
            ) : (
              results.map((item, index) => {
                const Icon = item.icon;
                const active = index === activeIndex;

                return (
                  <button
                    key={item.href}
                    type="button"
                    onMouseEnter={() => setActiveIndex(index)}
                    onClick={() => goTo(item.href)}
                    className={cn(
                      'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors',
                      active ? 'bg-primary/10 text-primary' : 'text-foreground hover:bg-muted/70'
                    )}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    <span className="min-w-0 flex-1 truncate font-medium">{item.name}</span>
                    <span className="hidden text-[10px] uppercase tracking-wide text-muted-foreground sm:block">
                      {item.group}
                    </span>
                    {active && <CornerDownLeft className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />}
                  </button>
                );
              })
            )}
          </div>

          <div className="border-t border-border/70 bg-muted/40 px-4 py-2 text-[11px] text-muted-foreground">
            Use ↑ ↓ to navigate · Enter to open
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
