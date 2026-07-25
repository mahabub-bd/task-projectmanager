import { Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';


import { NotificationProvider } from './components/notifications/NotificationProvider';
import RouteWrapper from './components/routing/RouteWrapper';
import { routes } from './components/routing/routes.config';
import { FullPageLoader } from './components/ui/loading-spinner';
import { PageActionsProvider } from './contexts/PageActionsContext';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <NotificationProvider>
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
    </NotificationProvider>
  );
}

export default App;