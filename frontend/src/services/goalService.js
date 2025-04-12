import axios from 'axios';

const API_URL = 'https://responsive-calendar-backend.onrender.com/api/goals/create';

const getAllGoals = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

const createGoal = async (goalData) => {
  const response = await axios.post(API_URL, goalData);
  return response.data;
};

const goalService = {
  getAllGoals,
  createGoal
};

export default goalService;