import { Suspense, useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';


import RouteWrapper from './components/routing/RouteWrapper';
import { routes } from './components/routing/routes.config';
import { FullPageLoader } from './components/ui/loading-spinner';
import { PageActionsProvider } from './contexts/PageActionsContext';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  // Prefetch the dashboard (heaviest page) while the browser is idle,
  // so its code-split chunk is ready before the user navigates to it.
  useEffect(() => {
    const prefetch = () => import('@/pages/DashboardPage');
    const id =
      typeof requestIdleCallback === 'function'
        ? requestIdleCallback(prefetch)
        : setTimeout(prefetch, 1500);
    return () => {
      if (typeof cancelIdleCallback === 'function' && typeof id === 'number') cancelIdleCallback(id);
      else clearTimeout(id as number);
    };
  }, []);

  return (
    <PageActionsProvider>
      <div className="min-h-screen bg-background">
        <Suspense fallback={<FullPageLoader text="Loading..." />}>
          <Routes>
            {routes.map((route) => (
              <Route
                key={route.path}
                path={route.path}
                element={
                  <RouteWrapper
                    isPublic={route.isPublic}
                    permission={route.permission}
                  >
                    {route.element}
                  </RouteWrapper>
                }
              />
            ))}

            {/* Catch all */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </div>
    </PageActionsProvider>
  );
}

export default App;
