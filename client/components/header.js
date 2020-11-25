import React from 'react'
import { Link, Route } from 'react-router-dom'
import TaskListDate from './taskListDate'

const Header = ({ category, taskDate, date }) => {
  return (
    <div>
      <div className="flex items-center justify-between flex-wrap my-0 bg-indigo-800 p-6">
        <div className="uppercase text-white font-bold text-2xl">{category}</div>
        <div className="w-full block justify-end flex-grow lg:flex lg:items-center lg:w-auto">
          {category && !date && (
            <div>
              <Link
                to={`/${category}/day`}
                className="inline-block text-sm px-4 py-2 leading-none border rounded text-white border-white hover:border-transparent hover:text-teal-500 hover:bg-white mr-4 lg:mt-0"
              >
                Day
              </Link>
              <Link
                to={`/${category}/week`}
                className="inline-block text-sm px-4 py-2 leading-none border rounded text-white border-white hover:border-transparent hover:text-teal-500 hover:bg-white mr-4 lg:mt-0"
              >
                Week
              </Link>
              <Link
                to={`/${category}/month`}
                className="inline-block text-sm px-4 py-2 leading-none border rounded text-white border-white hover:border-transparent hover:text-teal-500 hover:bg-white mr-4 lg:mt-0"
              >
                Month
              </Link>
            </div>
          )}
          <Link
            to="/"
            className="inline-block text-sm px-4 py-2 leading-none border rounded text-white border-white hover:border-transparent hover:text-teal-500 hover:bg-white mr-4 lg:mt-0"
          >
            Back To Main
          </Link>
          {date && (
            <Link
              to={`/${category}`}
              className="inline-block text-sm px-4 py-2 leading-none border rounded text-white border-white hover:border-transparent hover:text-teal-500 hover:bg-white mr-4 lg:mt-0"
            >
              Back to Category
            </Link>
          )}
        </div>
      </div>
      <Route exact path="/:category/:date" component={() => <TaskListDate taskDate={taskDate} />} />
    </div>
  )
}

export default Header
