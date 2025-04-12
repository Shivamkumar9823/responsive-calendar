import { configureStore } from '@reduxjs/toolkit';
import eventReducer from '../reducers/eventReducer';
import goalReducer from '../reducers/goalReducer';
import taskReducer from '../reducers/taskReducer';
import uiReducer from '../reducers/uiReducer';

export const store = configureStore({
  reducer: {
    events: eventReducer,
    goals: goalReducer,
    tasks: taskReducer,
    ui: uiReducer
  }
});