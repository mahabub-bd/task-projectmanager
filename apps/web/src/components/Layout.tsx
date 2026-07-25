import { ReactNode, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { usePageActions } from '../contexts/PageActionsContext';
import { cn } from '../lib/utils';
import { Header } from './layout/Header';
import { Sidebar } from './layout/Sidebar';
import { useBreadcrumbs } from './layout/breadcrumbs';
import { useFilteredNavigation } from './layout/use-filtered-navigation';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({});
  const location = useLocation();
  const { actions } = usePageActions();

  const filteredNavigation = useFilteredNavigation();
  const breadcrumbs = useBreadcrumbs();

  const toggleGroup = (groupTitle: string) => {
    setCollapsedGroups(prev => ({
      ...prev,
      [groupTitle]: !prev[groupTitle]
    }));
  };

  const isActive = (href: string) => {
    // Exact match
    if (location.pathname === href) return true;

    // Check for child routes, but exclude specific cases
    if (location.pathname.startsWith(href + '/')) {
      // Don't mark /permissions as active when on /permissions/by-role
      if (href === '/permissions' && location.pathname.startsWith('/permissions/by-role')) {
        return false;
      }
      return true;
    }

    return false;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        navigation={filteredNavigation}
        collapsedGroups={collapsedGroups}
        onToggleGroup={toggleGroup}
        isActive={isActive}
        pageActions={actions}
      />

      {/* Main content */}
      <div className={cn('flex-1 transition-all duration-300', sidebarOpen && 'lg:ml-72 xl:ml-64')}>
        {/* Header */}
        <Header
          onMenuOpen={() => setSidebarOpen(true)}
          breadcrumbs={breadcrumbs}
        />

        {/* Page content */}
        <main className="p-6">
          {children}
        </main>
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-background/80 backdrop-blur-sm lg:hidden xl:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
