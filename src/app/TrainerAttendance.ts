import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface AttendanceState {
  trainerAttendance: { [trainerId: string]: boolean };
  trainerIds: string[];
}

const initialState: AttendanceState = {
  trainerAttendance: {},
  trainerIds: [],
};

const TrainerAttendanceSlice = createSlice({
  name: 'trainerAttendance',
  initialState,
  reducers: {
    toggleAttendance: (state, action: PayloadAction<{ trainerId: string }>) => {
      const { trainerId } = action.payload;
      state.trainerAttendance[trainerId] = !state.trainerAttendance[trainerId];
      if (state.trainerAttendance[trainerId]) {
        state.trainerIds.push(trainerId);
      } else {
        state.trainerIds = state.trainerIds.filter(id => id !== trainerId);
      }
    },
    clearAttendance: (state) => {
      state.trainerAttendance = {};
      state.trainerIds = [];
    },
  },
});

export const { toggleAttendance, clearAttendance } = TrainerAttendanceSlice.actions;
export default TrainerAttendanceSlice.reducer;
