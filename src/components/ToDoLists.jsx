import { faCheck, faTrash } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { v4 as uuidv4 } from 'uuid';
import React from 'react'

const ToDoLists = ({ tasks, onDeleteTask, handleChecking }) => {

  return (
    <div key={uuidv4()}>
      {tasks.map((task, index) => (
        <div key={index} className='mt-8 flex items-center justify-between'>
          <div className='flex gap-4 items-center'>
            {/* Check or unchecked icons */}
            <FontAwesomeIcon
              icon={faCheck}
              color='white'
              className={`${task.checked ? 'bg-violet-600' : 'bg-transparent'} ${task.checked ? 'border-none' : 'border-2'} p-[6px] rounded-full`}
              onClick={() => handleChecking(task.id)}
            />

            {/* Task title  */}
            <h3 className = {`${task.checked ? 'line-through' : ''}`}>{task.title}</h3>
          </div>

          {/* Delete button */}
          <FontAwesomeIcon
            icon={faTrash}
            className='text-red-300'
            onClick={() => onDeleteTask(task.id)}
          />
        </div>
      ))}
    </div>
  )
}

export default ToDoLists