import { configureStore } from '@reduxjs/toolkit'
import { playersApiSlice } from './Api/PlayerSliceApi'
import { TrainerApiSlice } from './Api/TrainerApiSlice'

export const store = configureStore({
  reducer: {
    [playersApiSlice.reducerPath]: playersApiSlice.reducer,
    [TrainerApiSlice.reducerPath]: TrainerApiSlice.reducer

  },
  middleware  : getDefaultMiddleware => getDefaultMiddleware({
    serializableCheck:false,
  }).concat([playersApiSlice.middleware]),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch