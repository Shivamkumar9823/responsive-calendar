import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import goalService from '../services/goalService';

export const fetchGoals = createAsyncThunk(
  'goals/fetchGoals',
  async (_, { rejectWithValue }) => {
    try {
      return await goalService.getAllGoals();
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const createGoal = createAsyncThunk(
  'goals/createGoal',
  async (goalData, { rejectWithValue }) => {
    try {
      return await goalService.createGoal(goalData);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const goalSlice = createSlice({
  name: 'goals',
  initialState: {
    goals: [],
    loading: false,
    error: null,
    selectedGoal: null
  },
  reducers: {
    selectGoal: (state, action) => {
      state.selectedGoal = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchGoals.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchGoals.fulfilled, (state, action) => {
        state.loading = false;
        state.goals = action.payload;
      })
      .addCase(fetchGoals.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createGoal.fulfilled, (state, action) => {
        state.goals.push(action.payload);
      });
  }
});

export const { selectGoal } = goalSlice.actions;
export default goalSlice.reducer;