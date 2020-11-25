import express from 'express'
import path from 'path'
import cors from 'cors'
import bodyParser from 'body-parser'
import sockjs from 'sockjs'
import { renderToStaticNodeStream } from 'react-dom/server'
import React from 'react'

import cookieParser from 'cookie-parser'
import config from './config'
import Html from '../client/html'

const Root = () => ''

try {
  // eslint-disable-next-line import/no-unresolved
  // ;(async () => {
  //   const items = await import('../dist/assets/js/root.bundle')
  //   console.log(JSON.stringify(items))

  //   Root = (props) => <items.Root {...props} />
  //   console.log(JSON.stringify(items.Root))
  // })()
  console.log(Root)
} catch (ex) {
  console.log(' run yarn build:prod to enable ssr')
}
const fs = require('fs')

let connections = []

const { readFile, writeFile } = require('fs').promises
const shortid = require('shortid')

const port = process.env.PORT || 8090
const server = express()

const middleware = [
  cors(),
  express.static(path.resolve(__dirname, '../dist/assets')),
  bodyParser.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 }),
  bodyParser.json({ limit: '50mb', extended: true }),
  cookieParser()
]

middleware.forEach((it) => server.use(it))

const wFile = async (category, data) => {
  await writeFile(`${__dirname}/tasks/${category}.json`, JSON.stringify(data), {
    encoding: 'utf8'
  })
}
const rFile = (category) => {
  return readFile(`${__dirname}/tasks/${category}.json`, { encoding: 'utf8' })
    .then((res) => JSON.parse(res))
    .catch(() => {
      return []
    })
}

const filteredKey = (tasks) => {
  return tasks.reduce((acc, rec) => {
    // eslint-disable-next-line no-underscore-dangle
    if (rec._isDeleted) {
      return acc
    }
    return [...acc, { taskId: rec.taskId, title: rec.title, status: rec.status }]
  }, [])
}

server.get('/api/v1/tasks/:category', async (req, res) => {
  const { category } = req.params
  const task = filteredKey(await rFile(category))
  res.json(task)
})
server.get('/api/v1/tasks/:category/:timespan', async (req, res) => {
  const { category, timespan } = req.params
  const timePeriod = {
    day: 1000 * 60 * 60 * 24,
    week: 7 * 1000 * 60 * 60 * 24,
    month: 30 * 1000 * 60 * 60 * 24
  }
  const taskList = await rFile(category)
  const newTaskList = filteredKey(
    // eslint-disable-next-line no-underscore-dangle
    taskList.filter((el) => el._createdAt + timePeriod[timespan] > +new Date())
  )
  res.json(newTaskList)
})

server.post('/api/v1/tasks/:category', async (req, res) => {
  try {
    const { category } = req.params
    const newData = {
      taskId: shortid.generate(),
      title: req.body.title,
      status: 'new',
      _isDeleted: false,
      _createdAt: +new Date(),
      _deletedAt: null
    }
    const taskList = await rFile(category)
    const newTaskList = [...taskList, newData]
    wFile(category, newTaskList)
    res.json(taskList)
  } catch (error) {
    res.json(error.message)
  }
})
server.patch('/api/v1/tasks/:category/:id', async (req, res) => {
  const { category, id } = req.params
  const taskList = await rFile(category)
  const updateTitle = taskList.map((task) => {
    return task.taskId === id ? { ...task, ...req.body } : task
  })
  wFile(category, updateTitle)
  res.json(updateTitle)
})
server.patch('/api/v1/tasks/:category/:id', async (req, res) => {
  const { category, id } = req.params
  const status = ['done', 'new', 'in progress', 'blocked']
  if (status.includes(req.body.status)) {
    const taskList = await rFile(category)
    const updatedStatus = taskList.map((task) =>
      task.taskId === id ? { ...task, ...req.body } : task
    )
    wFile(category, updatedStatus)
    res.json(updatedStatus)
  } else {
    res.json({ status: 'error', message: 'incorrect status' })
  }
})

server.delete('/api/v1/tasks/:category/:id', async (req, res) => {
  const { category, id } = req.params
  const taskList = await rFile(category)
  const deletedFile = taskList.map((el) =>
    // eslint-disable-next-line no-param-reassign,no-underscore-dangle
    el.taskId === id ? { ...el, _isDeleted: true } : el
  )
  wFile(category, deletedFile)
  res.json(deletedFile)
})

server.get('/api/v1/categories', (req, res) => {
  const foldersName = fs.readdirSync(`${__dirname}/tasks`).map((el) => el.split('.json').join(''))
  res.json(foldersName)
})

server.use('/api/', (req, res) => {
  res.status(404)
  res.end()
})

const [htmlStart, htmlEnd] = Html({
  body: 'separator',
  title: 'Boilerplate'
}).split('separator')

server.get('/', (req, res) => {
  const appStream = renderToStaticNodeStream(<Root location={req.url} context={{}} />)
  res.write(htmlStart)
  appStream.pipe(res, { end: false })
  appStream.on('end', () => {
    res.write(htmlEnd)
    res.end()
  })
})

server.get('/*', (req, res) => {
  const initialState = {
    location: req.url
  }

  return res.send(
    Html({
      body: '',
      initialState
    })
  )
})

const app = server.listen(port)

if (config.isSocketsEnabled) {
  const echo = sockjs.createServer()
  echo.on('connection', (conn) => {
    connections.push(conn)
    conn.on('data', async () => {})

    conn.on('close', () => {
      connections = connections.filter((c) => c.readyState !== 3)
    })
  })
  echo.installHandlers(app, { prefix: '/ws' })
}
console.log(`Serving at http://localhost:${port}`)
