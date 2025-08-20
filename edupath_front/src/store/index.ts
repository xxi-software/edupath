import { configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import authSlice from "./authSlice";
import usersSlice from "./usersSlice"; // 1. Importar el reducer de usuarios

const authPersistConfig = {
  key: "auth", // Es buena práctica darle una key única a cada reducer que persistes
  storage,
};

const persistedAuthReducer = persistReducer(authPersistConfig, authSlice);

export const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
    users: usersSlice, // 2. Añadir el reducer de usuarios al store
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignorar acciones de redux-persist
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE', 'persist/PURGE'],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
