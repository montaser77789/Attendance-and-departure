// playerAttendance.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface AttendanceState {
  playerAttendance: { [playerId: string]: boolean };
  playerIds: string[];
  notSelectedPlayerIds: string[];
}

const initialState: AttendanceState = {
  playerAttendance: {},
  playerIds: [],
  notSelectedPlayerIds: [],
};

const playerAttendanceSlice = createSlice({
  name: 'playerAttendance',
  initialState,
  reducers: {
    toggleAttendance: (state, action: PayloadAction<{ playerId: string }>) => {
      const { playerId } = action.payload;
      state.playerAttendance[playerId] = !state.playerAttendance[playerId];
      if (state.playerAttendance[playerId]) {
        state.playerIds.push(playerId);
      } else {
        state.playerIds = state.playerIds.filter(id => id !== playerId);
      }
    },
    clearAttendance: (state) => {
      state.playerAttendance = {};
      state.playerIds = [];
      state.notSelectedPlayerIds = [];
    },
    setNotSelectedPlayerIds: (state, action: PayloadAction<{ playerIds: string[] }>) => {
      state.notSelectedPlayerIds = action.payload.playerIds;
    },
  },
});

export const { toggleAttendance, clearAttendance, setNotSelectedPlayerIds } = playerAttendanceSlice.actions;
export default playerAttendanceSlice.reducer;
