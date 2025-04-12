import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import taskService from '../services/taskService';

export const fetchTasks = createAsyncThunk(
  'tasks/fetchTasks',
  async (goalId = null, { rejectWithValue }) => {
    try {
      return await taskService.getTasks(goalId);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const createTask = createAsyncThunk(
  'tasks/createTask',
  async (taskData, { rejectWithValue }) => {
    try {
      return await taskService.createTask(taskData);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateTask = createAsyncThunk(
  'tasks/updateTask',
  async ({ id, taskData }, { rejectWithValue }) => {
    try {
      return await taskService.updateTask(id, taskData);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const taskSlice = createSlice({
  name: 'tasks',
  initialState: {
    tasks: [],
    filteredTasks: [],
    loading: false,
    error: null
  },
  reducers: {
    filterTasksByGoal: (state, action) => {
      const goalId = action.payload;
      if (goalId) {
        state.filteredTasks = state.tasks.filter(task => task.goalId._id === goalId);
      } else {
        state.filteredTasks = state.tasks;
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload;
        state.filteredTasks = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.tasks.push(action.payload);
        // Re-filter to ensure consistency
        const goalId = state.selectedGoalId;
        if (goalId) {
          state.filteredTasks = state.tasks.filter(task => task.goalId._id === goalId);
        } else {
          state.filteredTasks = state.tasks;
        }
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        const index = state.tasks.findIndex(task => task._id === action.payload._id);
        if (index !== -1) {
          state.tasks[index] = action.payload;
        }
        // Re-filter to ensure consistency
        const goalId = state.selectedGoalId;
        if (goalId) {
          state.filteredTasks = state.tasks.filter(task => task.goalId._id === goalId);
        } else {
          state.filteredTasks = state.tasks;
        }
      });
  }
});

export const { filterTasksByGoal } = taskSlice.actions;
export default taskSlice.reducer;
