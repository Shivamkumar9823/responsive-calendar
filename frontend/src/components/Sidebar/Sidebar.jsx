import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { selectGoal,createGoal } from '../../reducers/goalReducer';
import { filterTasksByGoal, createTask } from '../../reducers/taskReducer';
import { openModal } from '../../reducers/uiReducer';
import './Sidebar.css';

const Sidebar = () => {
  const dispatch = useDispatch();
  const { goals } = useSelector(state => state.goals);
  const { filteredTasks } = useSelector(state => state.tasks);
  const { selectedGoal } = useSelector(state => state.goals);
  
  const [newGoalTitle, setNewGoalTitle] = useState('');
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newGoalColor, setNewGoalColor] = useState('#1f77b4');

  const handleGoalSelect = (goalId) => {
    const goal = goals.find(g => g._id === goalId);
    dispatch(selectGoal(goal));
    dispatch(filterTasksByGoal(goalId));
  };

  const handleAddGoal = (e) => {
    e.preventDefault();
    
    if (newGoalTitle.trim() !== '') {
      dispatch(createGoal({ 
        title: newGoalTitle,
        color: newGoalColor
      }));
      setNewGoalTitle('');
    }
  };

  const handleAddTask = (e) => {
    e.preventDefault();
    
    if (newTaskTitle.trim() !== '' && selectedGoal) {
      dispatch(createTask({
        title: newTaskTitle,
        goalId: selectedGoal._id
      }));
      setNewTaskTitle('');
    }
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    
    const { source, destination, draggableId } = result;
    
    // If dropping on the calendar
    if (destination.droppableId === 'calendar') {
      const task = filteredTasks.find(t => t._id === draggableId);
      
      if (task) {
        const now = new Date();
        const startTime = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate(),
          now.getHours(),
          0, 0, 0
        ).toISOString();
        
        const endTime = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate(),
          now.getHours() + 1,
          0, 0, 0
        ).toISOString();
        
        dispatch(openModal({
          type: 'new-event-from-task',
          data: {
            title: task.title,
            color: task.goalId.color,
            startTime,
            endTime
          }
        }));
      }
    }
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd} isDropDisabled={false}>
      <div className="sidebar">
        <div className="sidebar-section">
          <h2>Goals</h2>
          <ul className="goals-list">
            {goals.map(goal => (
              <li
                key={goal._id}
                className={`goal-item ${selectedGoal && selectedGoal._id === goal._id ? 'selected' : ''}`}
                onClick={() => handleGoalSelect(goal._id)}
                style={{ borderLeft: `5px solid ${goal.color}` }}
              >
                {goal.title}
              </li>
            ))}
          </ul>
          
          <form onSubmit={handleAddGoal} className="add-form">
            <input
              type="text"
              placeholder="New goal..."
              value={newGoalTitle}
              onChange={(e) => setNewGoalTitle(e.target.value)}
            />
            <input
              type="color"
              value={newGoalColor}
              onChange={(e) => setNewGoalColor(e.target.value)}
            />
            <button type="submit">Add</button>
          </form>
        </div>
        
        <div className="sidebar-section">
          <h2>Tasks</h2>
          <Droppable droppableId="tasks-list">
            {(provided) => (
              <ul
                className="tasks-list"
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                {filteredTasks.map((task, index) => (
                  <Draggable key={task._id} draggableId={task._id} index={index}>
                    {(provided) => (
                      <li
                        className="task-item"
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={{
                          ...provided.draggableProps.style,
                          borderLeft: `5px solid ${task.goalId.color}`
                        }}
                      >
                        {task.title}
                      </li>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </ul>
            )}
          </Droppable>
          
          {selectedGoal ? (
            <form onSubmit={handleAddTask} className="add-form">
              <input
                type="text"
                placeholder="New task..."
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
              />
              <button type="submit">Add</button>
            </form>
          ) : (
            <p className="hint-text">Select a goal to add tasks</p>
          )}
        </div>
      </div>
      
      {/* Calendar drop target */}
      <Droppable droppableId="calendar">
        {(provided) => (
          <div
            style={{ display: 'none' }}
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default Sidebar;
