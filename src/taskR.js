const express = require('express')
const task = require('../src/models/tasks')
const auth = require('../src/middleware/auth')
const user = require('../src/models/users')
const router = new express.Router()

router.post('/tasks', auth, async (req,res) => {
    const t = new task({
        ...req.body,
        owner : req.user._id
    })
    try{
        await t.save()
        res.send(t)
    }
    catch(e) {
        res.send(e)
    }
})


router.get('/tasks', auth, async (req,res) => {
    try {
        sort = {}
        match = {}
        if(req.query.completed) {
            match.completed = req.query.completed === 'true'
        }

        if(req.query.sortBy){
            parts = req.query.sortBy.split(':')
            sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
        }
       
        await req.user.populate({
            path : 'taskd',
            match ,
            options : {
                limit : parseInt(req.query.limit),
                skip : parseInt(req.query.skip),
                sort
            }
        },
        
        ).execPopulate()
        res.send(req.user.taskd)
    }
    catch(e) {
        res.send(e)
    }
    
})
router.get('/tasks/:id', auth,async (req,res) => {
    try{
        const _id = req.params.id
        const tasks = await task.find({_id,owner : req.user._id})
        res.send(tasks)
    }
    catch(e){
        res.send(e)
    }
    
})


router.patch('/tasks/:id', auth, async (req,res) => {
    const validUpdates = ['completed','description']
    const updates = Object.keys(req.body)
    const isValid = updates.every((update) => {
        return validUpdates.includes(update)
    })
    if(!isValid){
        res.send(404,{error : "correct vi ivvu bey"})
    }
    const _id = req.params.id
    try {
    const tasks= await task.findOne({_id, owner : req.user._id})
    if(!tasks){
        res.send(404,'')
     }
    updates.forEach((update) => {
        return tasks[update] = req.body[update]
    })
    await tasks.save()
    
    
    res.send(200,tasks)
}
catch(e){ res.send(500,e)}
})



router.delete('/tasks/:id', auth, async (req,res) => {
    try{
        const _id = req.params.id
       const tasks = await task.findOneAndDelete({_id, owner : req.user._id})
       if(!tasks){
           return res.send({error : "no such file"})
       }
       res.send(tasks)
    }
    catch(e) {
        res.send(e)
    }
    
})
module.exports = router