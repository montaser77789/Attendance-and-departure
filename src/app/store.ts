// src/app/store.ts

import { configureStore } from '@reduxjs/toolkit';
import loginReducer from './Api/Login'; // Ensure the path is correct
import { playersApiSlice } from './Api/PlayerSliceApi';
import { TrainerApiSlice } from './Api/TrainerApiSlice';

export const store = configureStore({
  reducer: {
    auth: loginReducer, // Ensure that loginReducer is imported correctly
    [playersApiSlice.reducerPath]: playersApiSlice.reducer,
    [TrainerApiSlice.reducerPath]: TrainerApiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat([playersApiSlice.middleware ,TrainerApiSlice.middleware ]),
  
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
