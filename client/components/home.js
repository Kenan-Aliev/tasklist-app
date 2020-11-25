import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Route, useParams } from 'react-router-dom'
import Header from './header'
// import wave from '../assets/images/wave.jpg'
import TaskList from './taskList'
import Main from './main'

const Home = () => {
  const [taskList, setTaskList] = useState([])
  const [taskDate, setTaskDate] = useState([])
  const { category, date } = useParams()
  useEffect(() => {
    if (date) {
      axios(`/api/v1/tasks/${category}/${date}`).then(({ data }) => setTaskDate(data))
    }
    axios(`/api/v1/tasks/${category}`).then(({ data }) => setTaskList(data))
  }, [category])
  return (
    <div>
      {!category && !date ? (
        <Route exact path="/" component={() => <Main />} />
      ) : (
        <div className="bg-green-800 h-screen">
          <Header category={category} taskDate={taskDate} date={date} />
          <Route
            exact
            path="/:category"
            component={() => <TaskList category={category} taskList={taskList} />}
          />
        </div>
      )}
    </div>
  )
}

Home.propTypes = {}

export default Home
