import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface AttendanceState {
  trainerAttendance: { [trainerId: string]: boolean };
  trainerIds: string[];
  notSelectedTrainerIds: string[]; // إضافة مصفوفة جديدة للمدربين غير المحددين
}

const initialState: AttendanceState = {
  trainerAttendance: {},
  trainerIds: [],
  notSelectedTrainerIds: [], // تهيئة المصفوفة
};

const TrainerAttendanceSlice = createSlice({
  name: 'trainerAttendance',
  initialState,
  reducers: {
    toggleAttendance: (state, action: PayloadAction<{ trainerId: string }>) => {
      const { trainerId } = action.payload;
      const isCurrentlySelected = state.trainerAttendance[trainerId];

      state.trainerAttendance[trainerId] = !isCurrentlySelected;

      if (!isCurrentlySelected) {
        // إذا كان غير محدد، أضف إلى trainerIds وأزل من notSelectedTrainerIds
        state.trainerIds.push(trainerId);
        state.notSelectedTrainerIds = state.notSelectedTrainerIds.filter(id => id !== trainerId);
      } else {
        // إذا كان محدد، أزل من trainerIds وأضف إلى notSelectedTrainerIds
        state.trainerIds = state.trainerIds.filter(id => id !== trainerId);
        state.notSelectedTrainerIds.push(trainerId);
      }
    },
    clearAttendance: (state) => {
      state.trainerAttendance = {};
      state.trainerIds = [];
      state.notSelectedTrainerIds = []; // قم بمسح المصفوفة الجديدة
    },
  },
});

export const { toggleAttendance, clearAttendance } = TrainerAttendanceSlice.actions;
export default TrainerAttendanceSlice.reducer;
