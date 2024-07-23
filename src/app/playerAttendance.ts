import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AttendanceState {
  playerAttendance: { [playerId: string]: boolean };
  playerIds: string[];
}

const initialState: AttendanceState = {
  playerAttendance: {},
  playerIds: [],
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
  },
});

export const { toggleAttendance } = playerAttendanceSlice.actions;
export default playerAttendanceSlice.reducer;
