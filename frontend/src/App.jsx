import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEvents } from './reducers/eventReducer';
import { fetchGoals } from './reducers/goalReducer';
import { fetchTasks } from './reducers/taskReducer';
import Calendar from './components/Calendar/Calendar';
import Sidebar from './components/Sidebar/Sidebar';
import EventModal from './components/Modal/EventModal';
import './App.css';

function App() {
  const dispatch = useDispatch();
  const { isModalOpen } = useSelector(state => state.ui);
  
  useEffect(() => {
    dispatch(fetchEvents());
    dispatch(fetchGoals());
    dispatch(fetchTasks());
  }, [dispatch]);

  return (
    <div className="app">
      <div className="app-container">
        <Sidebar />
        <Calendar />
      </div>
      {isModalOpen && <EventModal />}
    </div>
  );
}

export default App;