import { createContext, useContext, ReactNode, useState } from 'react';
import type { PageAction } from '@/types/components';

interface PageActionsContextType {
  actions: PageAction[];
  setActions: (actions: PageAction[]) => void;
}

const PageActionsContext = createContext<PageActionsContextType | undefined>(undefined);

export function PageActionsProvider({ children }: { children: ReactNode }) {
  const [actions, setActions] = useState<PageAction[]>([]);

  return (
    <PageActionsContext.Provider value={{ actions, setActions }}>
      {children}
    </PageActionsContext.Provider>
  );
}

export function usePageActions() {
  const context = useContext(PageActionsContext);
  if (!context) {
    throw new Error('usePageActions must be used within PageActionsProvider');
  }
  return context;
}
