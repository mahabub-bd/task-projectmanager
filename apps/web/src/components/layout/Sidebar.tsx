import { useOrganizationLogo } from '@/hooks/useOrganizationLogo';
import { cn } from '@/lib/utils';
import type { PageAction } from '@/types/components';
import { ChevronDown, PanelLeftClose, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Logo } from './Logo';
import type { NavGroup } from './types';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  navigation: NavGroup[];
  collapsedGroups: Record<string, boolean>;
  onToggleGroup: (title: string) => void;
  isActive: (href: string) => boolean;
  pageActions: PageAction[];
}

export function Sidebar({
  isOpen,
  onClose,
  navigation,
  collapsedGroups,
  onToggleGroup,
  isActive,
  pageActions,
}: SidebarProps) {
  const { logoUrl, hasThemeSpecificLogos, organizationName } = useOrganizationLogo();

  return (
    <aside
      aria-label="Sidebar navigation"
      className={cn(
        'fixed inset-y-0 left-0 z-40 flex w-[288px] flex-col border-r border-border/70 bg-card/95 backdrop-blur-xl transition-transform duration-300 lg:w-64',
        !isOpen && '-translate-x-full'
      )}
    >
      {/* Brand / workspace */}
      <div className="flex h-16 shrink-0 items-center gap-2 border-b border-border/70 px-4">
        <div className="flex min-w-0 flex-1 items-center gap-2.5">
          <div className="grid h-9 w-9 shrink-0 place-items-center overflow-hidden rounded-xl border border-border/70 bg-background/70">
            {hasThemeSpecificLogos && logoUrl ? (
              <img
                src={logoUrl}
                alt={organizationName || 'Organization'}
                className="h-full w-full object-contain"
              />
            ) : (
              <Logo className="h-6 w-auto" />
            )}
          </div>

          <div className="min-w-0">
            <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              Workspace
            </p>
            <p className="truncate text-sm font-semibold tracking-tight">
              {organizationName || 'Taskflow'}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          aria-label="Close navigation"
          title="Close navigation"
          className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-muted/70 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <X className="h-4 w-4 lg:hidden" />
          <PanelLeftClose className="hidden h-4 w-4 lg:block" />
        </button>
      </div>

      {/* Navigation */}
      <nav aria-label="Main navigation" className="sidebar-nav flex-1 overflow-y-auto px-3 py-4">
        <div className="space-y-5">
          {navigation.map((group) => {
            const collapsed = Boolean(collapsedGroups[group.title]);
            const groupId = `nav-group-${group.title.toLowerCase().replace(/\s+/g, '-')}`;

            return (
              <div key={group.title}>
                <button
                  type="button"
                  onClick={() => onToggleGroup(group.title)}
                  aria-expanded={!collapsed}
                  aria-controls={groupId}
                  className="group flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <span>{group.title}</span>
                  <ChevronDown
                    className={cn(
                      'h-3.5 w-3.5 transition-transform duration-200',
                      collapsed && '-rotate-90'
                    )}
                  />
                </button>

                <div id={groupId} className={cn('mt-1 space-y-0.5', collapsed && 'hidden')}>
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
                          'group relative flex items-center gap-3 rounded-lg px-2.5 py-2 text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                          active
                            ? 'bg-primary/10 text-primary'
                            : 'text-muted-foreground hover:bg-muted/70 hover:text-foreground'
                        )}
                      >
                        {active && (
                          <span
                            aria-hidden="true"
                            className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-r-full bg-primary"
                          />
                        )}
                        <Icon
                          className={cn(
                            'h-4 w-4 shrink-0 transition-colors',
                            active ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'
                          )}
                        />
                        <span className="min-w-0 flex-1 truncate">{item.name}</span>
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
        <div className="shrink-0 border-t border-border/70 p-3">
          <p className="px-2.5 pb-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            Page actions
          </p>
          <div className="space-y-1">
            {pageActions.map((action, index) => (
              <button
                key={index}
                type="button"
                onClick={action.onClick}
                disabled={action.disabled}
                className={cn(
                  'flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs font-medium transition-colors hover:bg-muted/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
                  action.variant === 'destructive'
                    ? 'text-destructive hover:bg-destructive/10'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {action.icon && <span className="grid h-5 w-5 shrink-0 place-items-center">{action.icon}</span>}
                <span className="min-w-0 flex-1 truncate text-left">{action.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </aside>
  );
}
