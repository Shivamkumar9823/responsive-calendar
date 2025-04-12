import { createSlice } from '@reduxjs/toolkit';

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    isModalOpen: false,
    modalType: null,
    modalData: null,
    currentView: 'timeGridWeek',  // 'day', 'week', 'month'
    currentDate: new Date().toISOString()
  },
  reducers: {
    openModal: (state, action) => {
      state.isModalOpen = true;
      state.modalType = action.payload.type;
      state.modalData = action.payload.data || null;
    },
    closeModal: (state) => {
      state.isModalOpen = false;
      state.modalType = null;
      state.modalData = null;
    },
    changeView: (state, action) => {
      state.currentView = action.payload;
    },
    changeDate: (state, action) => {
      state.currentDate = action.payload;
    }
  }
});

export const { openModal, closeModal, changeView, changeDate } = uiSlice.actions;
export default uiSlice.reducer;
