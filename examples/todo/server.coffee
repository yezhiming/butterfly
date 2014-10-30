path = require 'path'
express = require 'express'
_ = require 'underscore'
app = express()

app.use(express.static(path.resolve('.')))

app.get '/', (req, res)->
  res.redirect '/index.html'

# mock data
tasks = [
  {id:'1', name: 'task1', done: false}
  {id:'2', name: 'task2', done: false}
  {id:'3', name: 'task3', done: false}
  {id:'4', name: 'task4', done: false}
  {id:'5', name: 'task5', done: false}
  {id:'6', name: 'task6', done: false}
  {id:'7', name: 'task7', done: false}
  {id:'8', name: 'task8', done: false}
  {id:'9', name: 'task9', done: false}
  {id:'10', name: 'task10', done: false}
  {id:'11', name: 'task11', done: false}
  {id:'12', name: 'task12', done: false}
  {id:'13', name: 'task13', done: false}
  {id:'14', name: 'task14', done: false}
  {id:'15', name: 'task15', done: false}
  {id:'16', name: 'task16', done: false}
  {id:'17', name: 'task17', done: false}
  {id:'18', name: 'task18', done: false}
  {id:'19', name: 'task19', done: false}
  {id:'20', name: 'task20', done: false}
  {id:'21', name: 'task21', done: false}
  ]

findById = (id) ->
  _.find(tasks, (task) -> task.id == id)

# emulate lagacy system API, return result array only
legacy = false

#page number start from 0
#pageSize default to array length
app.get '/api/tasks', (req, res) ->
  page = parseInt(req.query.page) || 0
  pageSize = parseInt(req.query.pageSize) || tasks.length

  start = page * pageSize
  end = page * pageSize + pageSize * 1

  console.log "page: #{page}, pageSize: #{pageSize}, start: #{start}, end: #{end}"

  if legacy
    res.send(tasks[start...end])
  else
    res.send
      page: page
      pageCount: Math.ceil(tasks.length / pageSize)
      records: tasks[start...end]
      recordCount: tasks.length

# find a task by id
app.get '/api/tasks/:id', (req, res) ->
  console.log "find task: #{req.params.id}"
  task = findById(req.params.id)
  if task then res.send(task) else res.status(404).end()

# create a new task
app.post '/api/tasks', (req, res) ->
  if req.params.id and findById(req.params.id)
    res.status(400).send('id already exists')
  else
    newTask = _.pick(req.params, ['id', 'name', 'done'])
    console.log newTask
    tasks.push newTask
    res.status(200).end()

# delete a task by id
app.delete '/api/tasks/:id', (req, res) ->
  console.log "delete task: #{req.params.id}"
  tasks = _.reject(tasks, (task) -> task.id == req.params.id)
  res.status(200).end()

app.listen 3000

console.log 'Tasks App Listen on port 3000'
