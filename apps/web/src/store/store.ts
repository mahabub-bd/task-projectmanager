import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { persistReducer, persistStore } from 'redux-persist';
import { apiSlice } from './api';
import authReducer from './authSlice';
import { secureStorage } from './encryptedStorage';

// Redux Persist configuration for auth slice with encrypted storage
const persistConfig = {
  key: 'auth',
  storage: secureStorage,
  whitelist: ['user', 'isAuthenticated', 'access_token', 'refresh_token'], // Persist auth state including tokens (encrypted)
};

// Root reducer
const rootReducer = combineReducers({
  auth: persistReducer(persistConfig, authReducer),
  [apiSlice.reducerPath]: apiSlice.reducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['payload/drawer', 'persist/FLUSH', 'persist/REHYDRATE', 'persist/PAUSE', 'persist/PERSIST', 'persist/PURGE', 'persist/REGISTER'],
        ignoredPaths: ['auth'],
      },
    }).concat(apiSlice.middleware),
  devTools: import.meta.env.NODE_ENV !== 'production',
});

// Enable listeners for refetchOnFocus/refetchOnReconnect
setupListeners(store.dispatch);

// Create persistor
export const persistor = persistStore(store);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Typed hooks
import type { TypedUseSelectorHook } from 'react-redux';
import { useSelector } from 'react-redux';

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
