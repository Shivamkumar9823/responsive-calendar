import axios from 'axios';

const API_URL = 'https://responsive-calendar-backend.onrender.com/api/events';

const getAllEvents = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

const createEvent = async (eventData) => {
  const response = await axios.post(API_URL, eventData);
  return response.data;
};

const updateEvent = async (id, eventData) => {
  const response = await axios.put(`${API_URL}/${id}`, eventData);
  return response.data;
};

const deleteEvent = async (id) => {
  await axios.delete(`${API_URL}/${id}`);
  return id;
};

const eventService = {
  getAllEvents,
  createEvent,
  updateEvent,
  deleteEvent
};

export default eventService;