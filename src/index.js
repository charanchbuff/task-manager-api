const express = require('express')
require('./db/mongoose')
const user = require('./models/users')
const task = require('./models/tasks')
const taskRouter = require('../src/taskR')
const userRouter = require('./userR')
const auth = require('../src/middleware/auth')
const port = process.env.PORT
const app = express()

app.use(express.json())
app.use(taskRouter)
app.use(userRouter)
app.listen(port, () => {
    console.log('server up')
})
