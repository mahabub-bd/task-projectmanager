import { cn } from '@/lib/utils';
import type { PageAction } from '@/types/components';
import { ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { NavGroup } from './types';

interface SidebarProps {
  isOpen: boolean;
  collapsed: boolean;
  onClose: () => void;
  navigation: NavGroup[];
  collapsedGroups: Record<string, boolean>;
  onToggleGroup: (title: string) => void;
  isActive: (href: string) => boolean;
  pageActions: PageAction[];
}

export function Sidebar({
  isOpen,
  collapsed,
  onClose,
  navigation,
  collapsedGroups,
  onToggleGroup,
  isActive,
  pageActions,
}: SidebarProps) {
  return (
    <aside
      aria-label="Sidebar navigation"
      className={cn(
        'fixed top-16 bottom-0 left-0 z-40 flex flex-col border-r border-border/70 bg-card/95 backdrop-blur-xl transition-all duration-300 w-[240px]',
        !isOpen && '-translate-x-full',
        isOpen && (collapsed ? 'lg:w-16' : 'lg:w-52')
      )}
    >
      {/* Navigation */}
      <nav aria-label="Main navigation" className="sidebar-nav flex-1 overflow-y-auto px-2.5 py-3">
        <div className="space-y-4">
          {navigation.map((group) => {
            const groupCollapsed = Boolean(collapsedGroups[group.title]);
            const groupId = `nav-group-${group.title.toLowerCase().replace(/\s+/g, '-')}`;

            return (
              <div key={group.title}>
                <button
                  type="button"
                  onClick={() => onToggleGroup(group.title)}
                  aria-expanded={!groupCollapsed}
                  aria-controls={groupId}
                  className={cn(
                    'group flex w-full items-center justify-between rounded-md px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground/70 transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                    collapsed && 'justify-center gap-0'
                  )}
                >
                  <span className={cn('truncate', collapsed && 'hidden')}>{group.title}</span>
                  <ChevronDown
                    className={cn(
                      'h-3 w-3 shrink-0 transition-transform duration-200',
                      collapsed && 'hidden',
                      groupCollapsed && '-rotate-90'
                    )}
                  />
                </button>

                <div id={groupId} className={cn('mt-0.5 space-y-0.5', groupCollapsed && 'hidden')}>
                  {group.items.map((item) => {
                    const active = isActive(item.href);
                    const Icon = item.icon;

                    return (
                      <Link
                        key={item.name}
                        to={item.href}
                        aria-current={active ? 'page' : undefined}
                        onClick={() => {
                          if (window.innerWidth < 1024) onClose();
                        }}
                        className={cn(
                          'group relative flex items-center rounded-lg transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                          collapsed ? 'justify-center px-2 py-2 gap-0' : 'gap-2.5 px-2.5 py-1.5',
                          active
                            ? 'bg-primary/10 text-primary'
                            : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground'
                        )}
                      >
                        {active && (
                          <span
                            aria-hidden="true"
                            className="absolute left-0 top-1/2 h-4 w-0.5 -translate-y-1/2 rounded-r-full bg-primary"
                          />
                        )}
                        <Icon
                          className={cn(
                            'shrink-0 transition-colors',
                            collapsed ? 'h-[18px] w-[18px]' : 'h-4 w-4',
                            active ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'
                          )}
                        />
                        <span className={cn('min-w-0 flex-1 truncate', collapsed && 'hidden')}>
                          {item.name}
                        </span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </nav>

      {/* Page-specific actions */}
      {pageActions.length > 0 && (
        <div className="shrink-0 border-t border-border/60 p-2.5">
          <p className="px-2 pb-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground/70">
            Page actions
          </p>
          <div className="space-y-0.5">
            {pageActions.map((action, index) => (
              <button
                key={index}
                type="button"
                onClick={action.onClick}
                disabled={action.disabled}
                className={cn(
                  'flex w-full rounded-lg text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
                  collapsed ? 'justify-center px-2 py-2 gap-0' : 'items-center gap-2 px-2.5 py-1.5',
                  action.variant === 'destructive'
                    ? 'text-destructive hover:bg-destructive/10'
                    : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground'
                )}
              >
                {action.icon && (
                  <span className={cn('grid shrink-0 place-items-center', collapsed ? 'h-5 w-5' : 'h-4 w-4')}>
                    {action.icon}
                  </span>
                )}
                <span className={cn('min-w-0 flex-1 truncate text-left', collapsed && 'hidden')}>
                  {action.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </aside>
  );
}
