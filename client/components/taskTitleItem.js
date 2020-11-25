import React, { useState } from 'react'
import axios from 'axios'

const TaskTitleItem = ({ ttl, stat, taskId, category }) => {
  const [editTask, setEditTask] = useState(false)
  const [editTitle, setEditTitle] = useState('')
  const saveEditTitle = (title, id) => {
    axios.patch(`/api/v1/tasks/${category}/${id}`, { title })
  }
  const updateStatus = (id, status) => {
    axios.patch(`/api/v1/tasks/${category}/${id}`, { status })
  }
  return (
    <div className="flex justify-center align-center  block my-0 mx-auto">
      {editTask || (
        <div className="flex  align-center my-4">
          <button
            type="button"
            className="inline-block text-sm px-4 py-2 leading-none border rounded text-white border-white hover:border-transparent hover:text-teal-500 hover:bg-white mr-4 lg:mt-0"
            onClick={() => {
              setEditTask(true)
              setEditTitle(ttl)
            }}
          >
            Edit
          </button>
          <div className="text-yellow-600">{ttl}</div>
        </div>
      )}

      {editTask && (
        <div className="flex items-center  my-4">
          <button
            type="button"
            className="inline-block text-sm px-4 py-2 leading-none border rounded text-white border-white hover:border-transparent hover:text-teal-500 hover:bg-white mr-4 lg:mt-0"
            onClick={() => {
              setEditTask(false)
              saveEditTitle(editTitle, taskId)
            }}
          >
            Save
          </button>
          <input
            type="text"
            value={editTitle}
            className="mr-8 placeholder-gray-600 focus:placeholder-gray-500 border-b text-white border-white outline-none border-current bg-transparent"
            onChange={(e) => setEditTitle(e.target.value)}
          />
        </div>
      )}
      {stat === 'new' && (
        <div className="flex items-center ">
          <button
            type="button"
            className="ml-4 inline-block text-sm px-4 py-2 leading-none border rounded text-white border-white hover:border-transparent hover:text-teal-500 hover:bg-white mr-4 lg:mt-0"
            onClick={() => {
              updateStatus(taskId, 'in progress')
            }}
          >
            In progress
          </button>
        </div>
      )}
      {stat === 'in progress' && (
        <div className="flex items-center ">
          <button
            type="button"
            className="ml-4 inline-block text-sm px-4 py-2 leading-none border rounded text-white border-white hover:border-transparent hover:text-teal-500 hover:bg-white mr-4 lg:mt-0"
            onClick={() => {
              updateStatus(taskId, 'blocked')
            }}
          >
            blocked
          </button>
          <button
            type="button"
            className="inline-block text-sm px-4 py-2 leading-none border rounded text-white border-white hover:border-transparent hover:text-teal-500 hover:bg-white mr-4 lg:mt-0"
            onClick={() => {
              updateStatus(taskId, 'done')
            }}
          >
            done
          </button>
        </div>
      )}
      {stat === 'blocked' && (
        <div className="flex items-center ">
          <button
            type="button"
            className="ml-4 inline-block text-sm px-4 py-2 leading-none border rounded text-white border-white hover:border-transparent hover:text-teal-500 hover:bg-white mr-4 lg:mt-0"
            onClick={() => {
              updateStatus(taskId, 'in progress')
            }}
          >
            Unblock
          </button>
        </div>
      )}
    </div>
  )
}

export default TaskTitleItem
