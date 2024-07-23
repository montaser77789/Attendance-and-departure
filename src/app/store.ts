import { configureStore } from "@reduxjs/toolkit";
import loginReducer from "./Api/Login"; // Ensure the path is correct
import { playersApiSlice } from "./Api/PlayerSliceApi";
import { TrainerApiSlice } from "./Api/TrainerApiSlice";
import { CvilizedregionApi } from "./Api/Cvilizedregion";
import playerAttendanceSlice from "./playerAttendance";
import TrainerAttendanceSlice from "./TrainerAttendance";

export const store = configureStore({
  reducer: {
    playerAttendance: playerAttendanceSlice,
    trainerAttendance:TrainerAttendanceSlice,
    auth: loginReducer, 
    [playersApiSlice.reducerPath]: playersApiSlice.reducer,
    [TrainerApiSlice.reducerPath]: TrainerApiSlice.reducer,
    [CvilizedregionApi.reducerPath]: CvilizedregionApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat([
      playersApiSlice.middleware,
      TrainerApiSlice.middleware,
      CvilizedregionApi.middleware,
    ]),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
