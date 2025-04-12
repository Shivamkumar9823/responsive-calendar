import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { closeModal } from '../../reducers/uiReducer';
import { createEvent, updateEvent, deleteEvent } from '../../reducers/eventReducer';
import './EventModal.css';

const EVENT_CATEGORIES = [
  { value: 'exercise', label: 'Exercise', color: '#ff7f0e' },
  { value: 'eating', label: 'Eating', color: '#2ca02c' },
  { value: 'work', label: 'Work', color: '#1f77b4' },
  { value: 'relax', label: 'Relax', color: '#9467bd' },
  { value: 'family', label: 'Family', color: '#e377c2' },
  { value: 'social', label: 'Social', color: '#8c564b' }
];

const EventModal = () => {
  const dispatch = useDispatch();
  const { modalType, modalData } = useSelector(state => state.ui);
  
  const [formData, setFormData] = useState({
    title: '',
    category: 'work',
    startDate: '',
    startTime: '',
    endDate: '',
    endTime: '',
    color: '#1f77b4' // default color for work
  });

  useEffect(() => {
    if (modalData) {
      // For new event from date click
      if (modalType === 'new-event' && modalData.startTime) {
        const startDate = new Date(modalData.startTime);
        const endDate = new Date(modalData.endTime || new Date(startDate.getTime() + 60 * 60 * 1000));
        
        setFormData({
          title: '',
          category: 'work',
          startDate: formatDate(startDate),
          startTime: formatTime(startDate),
          endDate: formatDate(endDate),
          endTime: formatTime(endDate),
          color: '#1f77b4'
        });
      } 
      // For new event from task drag
      else if (modalType === 'new-event-from-task') {
        const startDate = new Date(modalData.startTime);
        const endDate = new Date(modalData.endTime || new Date(startDate.getTime() + 60 * 60 * 1000));
        
        setFormData({
          title: modalData.title || '',
          category: 'work', // Default - can be changed by user
          startDate: formatDate(startDate),
          startTime: formatTime(startDate),
          endDate: formatDate(endDate),
          endTime: formatTime(endDate),
          color: modalData.color || '#1f77b4'
        });
      } 
      // For editing existing event
      else if (modalType === 'edit-event') {
        const startDate = new Date(modalData.startTime);
        const endDate = new Date(modalData.endTime);
        
        setFormData({
          title: modalData.title,
          category: modalData.category,
          startDate: formatDate(startDate),
          startTime: formatTime(startDate),
          endDate: formatDate(endDate),
          endTime: formatTime(endDate),
          color: modalData.color
        });
      }
    }
  }, [modalType, modalData]);

  const formatDate = (date) => {
    return date.toISOString().split('T')[0];
  };

  const formatTime = (date) => {
    return date.toTimeString().slice(0, 5);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'category') {
      const category = EVENT_CATEGORIES.find(cat => cat.value === value);
      setFormData({
        ...formData,
        [name]: value,
        color: category ? category.color : formData.color
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const startDateTime = new Date(`${formData.startDate}T${formData.startTime}`);
    const endDateTime = new Date(`${formData.endDate}T${formData.endTime}`);
    
    const eventData = {
      title: formData.title,
      category: formData.category,
      startTime: startDateTime.toISOString(),
      endTime: endDateTime.toISOString(),
      color: formData.color
    };
    
    if (modalType === 'edit-event') {
      dispatch(updateEvent({ id: modalData._id, eventData }));
    } else {
      dispatch(createEvent(eventData));
    }
    
    dispatch(closeModal());
  };

  const handleDelete = () => {
    if (modalType === 'edit-event' && modalData._id) {
        dispatch(deleteEvent(modalData._id));
        dispatch(closeModal());
      }
    };
  
    const handleClose = () => {
      dispatch(closeModal());
    };
  
    return (
      <div className="event-modal-overlay">
        <div className="event-modal">
          <div className="event-modal-header">
            <h2>{modalType === 'edit-event' ? 'Edit Event' : 'Create Event'}</h2>
            <button className="close-button" onClick={handleClose}>×</button>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="title">Title</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="category">Category</label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              >
                {EVENT_CATEGORIES.map(category => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="startDate">Start Date</label>
                <input
                  type="date"
                  id="startDate"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="startTime">Start Time</label>
                <input
                  type="time"
                  id="startTime"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="endDate">End Date</label>
                <input
                  type="date"
                  id="endDate"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="endTime">End Time</label>
                <input
                  type="time"
                  id="endTime"
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            
            <div className="form-actions">
              {modalType === 'edit-event' && (
                <button type="button" className="delete-button" onClick={handleDelete}>
                  Delete
                </button>
              )}
              <button type="submit" className="save-button">
                {modalType === 'edit-event' ? 'Update' : 'Create'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };
  
  export default EventModal;