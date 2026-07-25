import { cn } from '@/lib/utils';
import { useAuth } from '@/store/authHooks';
import { Building2, ChevronRight, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { NavGroup } from './types';
import type { PageAction } from '@/types/components';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  navigation: NavGroup[];
  collapsedGroups: Record<string, boolean>;
  onToggleGroup: (title: string) => void;
  isActive: (href: string) => boolean;
  pageActions: PageAction[];
}

export function Sidebar({ isOpen, onClose, navigation, collapsedGroups, onToggleGroup, isActive, pageActions }: SidebarProps) {
  const { user } = useAuth();

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-40 h-screen border-r bg-card transition-all duration-300 flex flex-col',
        'w-72 xl:w-64',
        !isOpen && '-translate-x-full'
      )}
    >
      {/* Sidebar Header */}
      <div className="h-16 border-b bg-card/95 backdrop-blur supports-backdrop-filter:bg-card/60">
        <div className="flex h-full items-center justify-between px-3 xl:px-4">
          <div className="flex items-center gap-2 xl:gap-3">
            {user?.organization_logo ? (
              <div className="h-16 xl:h-14 w-16 xl:w-14 overflow-hidden flex items-center justify-center">
                <img
                  src={user.organization_logo}
                  alt={user.organization_name || 'Organization'}
                  className="h-full w-full object-cover"
                />
              </div>
            ) : (
              <div className="flex h-9 xl:h-10 w-9 xl:w-10 items-center justify-center rounded-xl bg-linear-to-br from-primary to-primary/80 text-primary-foreground shadow-lg">
                <Building2 className="h-4 xl:h-5 w-4 xl:w-5" />
              </div>
            )}
            <div className="flex flex-col">
              {user?.organization_name && (
                <span className="text-sm xl:text-base font-semibold">
                  {user.organization_name}
                </span>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden xl:hidden p-1.5 hover:bg-accent rounded-md transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-2 xl:px-3 py-4 space-y-4 xl:space-y-6">
        {navigation.map((group) => (
          <div key={group.title}>
            <button
              onClick={() => onToggleGroup(group.title)}
              className="w-full flex items-center justify-between px-2 xl:px-3 py-1.5 xl:py-2 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-accent/50"
            >
              <span className="uppercase tracking-wider">{group.title}</span>
              <ChevronRight className={cn(
                "h-3 xl:h-3.5 w-3 xl:w-3.5 transition-transform duration-200",
                !collapsedGroups[group.title] && "transform rotate-90"
              )} />
            </button>
            {!collapsedGroups[group.title] && (
              <div className="space-y-0.5 mt-1">
                {group.items.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={cn(
                      "flex items-center gap-2 xl:gap-3 px-2 xl:px-3 py-2 xl:py-2.5 text-sm font-medium rounded-lg transition-all duration-200",
                      "hover:bg-accent",
                      isActive(item.href)
                        ? "bg-primary/10 text-primary shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <item.icon className={cn(
                      "h-4 xl:h-4.5 w-4 xl:w-4.5 transition-colors",
                      isActive(item.href) && "text-primary"
                    )} />
                    <span className="flex-1 text-left text-xs xl:text-sm">{item.name}</span>
                    {isActive(item.href) && (
                      <div className="h-1 xl:h-1.5 w-1 xl:w-1.5 rounded-full bg-primary" />
                    )}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>

      {/* Sidebar Footer */}
      <div className="border-t p-3 xl:p-4">
        {pageActions.length > 0 && (
          <div className="space-y-2">
            {pageActions.map((action, index) => (
              <button
                key={index}
                onClick={action.onClick}
                disabled={action.disabled}
                className={cn(
                  'w-full flex items-center gap-2 px-2 xl:px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200',
                  'hover:bg-accent',
                  action.variant === 'destructive'
                    ? 'text-destructive hover:text-destructive hover:bg-destructive/10'
                    : 'text-muted-foreground hover:text-foreground',
                  action.disabled && 'opacity-50 cursor-not-allowed'
                )}
              >
                {action.icon && <span>{action.icon}</span>}
                <span className="flex-1 text-left text-xs xl:text-sm">{action.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </aside>
  );
}
