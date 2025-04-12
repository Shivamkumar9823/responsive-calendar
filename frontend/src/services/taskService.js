import axios from 'axios';

const API_URL = 'http://localhost:5000/api/tasks';

const getTasks = async (goalId = null) => {
  let url = API_URL;
  if (goalId) {
    url += `?goalId=${goalId}`;
  }
  const response = await axios.get(url);
  return response.data;
};

const createTask = async (taskData) => {
  const response = await axios.post(API_URL, taskData);
  return response.data;
};

const updateTask = async (id, taskData) => {
  const response = await axios.put(`${API_URL}/${id}`, taskData);
  return response.data;
};

const taskService = {
  getTasks,
  createTask,
  updateTask
};

export default taskService;