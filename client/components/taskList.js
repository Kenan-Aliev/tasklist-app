import React, { useState } from 'react'
import axios from 'axios'
import TaskTitleItem from './taskTitleItem'

const TaskList = ({ category, taskList }) => {
  const [addTask, setAddTask] = useState('')

  const createTask = (title) => {
    axios.post(`/api/v1/tasks/${category}`, { title })
  }
  return (
    <div>
      {taskList.map((task) => {
        return (
          <TaskTitleItem
            key={task.taskId}
            taskId={task.taskId}
            ttl={task.title}
            stat={task.status}
            category={category}
          />
        )
      })}
      <div className="flex justify-center align-center  block my-0 mx-auto">
        <input
          type="text"
          className="mr-8 placeholder-gray-600 focus:placeholder-gray-500 border-b text-white border-white outline-none border-current bg-transparent"
          value={addTask}
          onChange={(e) => setAddTask(e.target.value)}
        />
        <button
          type="button"
          className="ml-4 inline-block text-sm px-4 py-2 leading-none border rounded text-white border-white hover:border-transparent hover:text-teal-500 hover:bg-white mr-4 lg:mt-0"
          onClick={() => createTask(addTask)}
        >
          Add
        </button>
      </div>
    </div>
  )
}
export default TaskList
