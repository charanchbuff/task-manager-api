const express = require('express')
require('./db/mongoose')
const user = require('./models/users')
const task = require('./models/tasks')
const taskRouter = require('../src/taskR')
const userRouter = require('./userR')
const auth = require('../src/middleware/auth')
const port = process.env.PORT || 3000
const app = express()

app.use(express.json())
app.use(taskRouter)
app.use(userRouter)
app.listen(port, () => {
    console.log('server up')
})

// const test = async () => {
//     try{
//         const users = await user.findById('5efaf3fc1c41723c70d3ee7d')
//         await users.populate('taskd').execPopulate()
//         console.log(users.taskd)
//     }
//     catch(e) {
//         console.log('Error')
//     }
   
// }
// test()