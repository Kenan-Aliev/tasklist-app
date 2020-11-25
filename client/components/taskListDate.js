import React from 'react'

const TaskListDate = ({ taskDate }) => {
  return (
    <div className="flex flex-wrap">
      {taskDate.map((task) => {
        return (
          <div
            key={task.taskId}
            className="my-5 mx-5 py-2 px-2  border rounded text-white    leading-none   border-white hover:border-transparent  hover:bg-white hover:text-teal-500 "
          >
            {task.title}
          </div>
        )
      })}
    </div>
  )
}
export default TaskListDate
