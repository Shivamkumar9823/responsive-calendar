import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { openModal } from '../../reducers/uiReducer';
import { updateEvent } from '../../reducers/eventReducer';
import './Calendar.css';

const Calendar = () => {
  const dispatch = useDispatch();
  const { events } = useSelector(state => state.events);
  const { currentView, currentDate } = useSelector(state => state.ui);

  // Transform events for FullCalendar
  const calendarEvents = events.map(event => ({
    id: event._id,
    title: event.title,
    start: event.startTime,
    end: event.endTime,
    backgroundColor: event.color,
    borderColor: event.color,
    extendedProps: {
      category: event.category
    }
  }));

  const handleDateClick = (info) => {
    const clickData = {
      startTime: info.date.toISOString(),
      endTime: new Date(info.date.getTime() + 60 * 60 * 1000).toISOString() // 1 hour later
    };
    
    dispatch(openModal({ type: 'new-event', data: clickData }));
  };

  const handleEventClick = (info) => {
    const eventId = info.event.id;
    const event = events.find(e => e._id === eventId);
    
    if (event) {
      dispatch(openModal({ type: 'edit-event', data: event }));
    }
  };

  const handleEventDrop = useCallback(({ event }) => {
    const eventId = event.id;
    const updatedEvent = {
      startTime: event.start.toISOString(),
      endTime: event.end ? event.end.toISOString() : new Date(event.start.getTime() + 60 * 60 * 1000).toISOString()
    };
    
    dispatch(updateEvent({ id: eventId, eventData: updatedEvent }));
  }, [dispatch]);

  const handleEventResize = useCallback(({ event }) => {
    const eventId = event.id;
    const updatedEvent = {
      startTime: event.start.toISOString(),
      endTime: event.end.toISOString()
    };
    
    dispatch(updateEvent({ id: eventId, eventData: updatedEvent }));
  }, [dispatch]);

  return (
    <div className="calendar-container">
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay'
        }}
        initialView={currentView}
        initialDate={currentDate}
        editable={true}
        selectable={true}
        selectMirror={true}
        dayMaxEvents={true}
        events={calendarEvents}
        dateClick={handleDateClick}
        eventClick={handleEventClick}
        eventDrop={handleEventDrop}
        eventResize={handleEventResize}
        height="auto"
      />
    </div>
  );
};

export default Calendar;
