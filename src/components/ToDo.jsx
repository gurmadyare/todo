import React, { useEffect, useRef, useState } from 'react';
import todoIcon from '../assets/todo-icon.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAdd } from '@fortawesome/free-solid-svg-icons';
import { v4 as uuidv4 } from 'uuid';
import ToDoLists from './ToDoLists';

const ToDo = () => {
  const inputRef = useRef();

  // Let's save state to local storage, so we don't lose it
  const LOCAL_STORAGE_KEY = 'tasks';

  // Make initial tasks variable and set it to the state,
  // so we don't lose our previous data when we refresh the page
  const initialTasks = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || [];
  const [tasks, setTasks] = useState(initialTasks);

  // Whenever the tasks state is changed, set the new tasks state to local storage.
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  // Function to handle adding new tasks.
  const addTask = async () => {
    const inputText = inputRef.current.value.trim();

    if (inputText) {
      try {
        const response = await fetch('http://localhost:3001/tasks', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id: uuidv4(), title: inputText, checked: false }),
        });

        if (response.ok) {
          const task = await response.json();
          setTasks([...tasks, task]);

          // After adding, clear the input field
          inputRef.current.value = '';
        } else {
          console.error('Error adding task:', response.statusText);
        }
      } catch (error) {
        console.error('Error adding task:', error);
      }
    }
  };

  //Function to handle task deletion 
  const deleteTask = (id) => {
    const updatedTasks = tasks.filter(task => task.id !== id);
    setTasks(updatedTasks);
  }

  // Function to handle task checking (toggling the checked state)
  const handleTaskChecking = async (id) => {
    try {
      // Find the task by id
      const taskToUpdate = tasks.find(task => task.id === id);

      // Toggle the checked property
      const updatedTask = { ...taskToUpdate, checked: !taskToUpdate.checked };

      // Update the task on the server
      const response = await fetch(`http://localhost:3001/tasks/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedTask),
      });

      if (response.ok) {
        // Update the state with the updated task
        const updatedTasks = tasks.map(task =>
          task.id === id ? { ...task, checked: !task.checked } : task
        );
        setTasks(updatedTasks);
      } else {
        console.error('Error updating task:', response.statusText);
      }
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };



  return (
    <div className='bg-white place-self-center w-11/12 max-w-md flex flex-col p-8 min-h-[560px] rounded-xl shadow-2xl'>
      <div className='flex gap-5 items-center'>
        <img src={todoIcon} alt="todo-icon" width={120} />
        <h1 className='text-3xl font-bold'>Task Manager App - ToDo List</h1>
      </div>
      <div className='mt-5 flex justify-between items-center bg-gray-100 border-none py-3 h-12 w-full rounded-full'>
        <input
          type="text"
          ref={inputRef}
          placeholder='Enter your task here...'
          className='bg-transparent px-5 outline-none'
        />
        <button
          className='bg-orange-400 py-3 w-[140px] text-white font-sans font-medium rounded-full cursor-pointer'
          onClick={addTask}
        >
          Add task
          <FontAwesomeIcon icon={faAdd} className='pl-2' />
        </button>
      </div>


      {/* Tasks */}
      <ToDoLists tasks={tasks} onDeleteTask={deleteTask} handleChecking={handleTaskChecking} />
    </div>
  );
};

export default ToDo;
