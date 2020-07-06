const express = require('express')
const user = require('./models/users')
const router = new express.Router()
const auth = require('../src/middleware/auth')
const multer = require('multer')
const sharp = require('sharp')
const {sendWelcomeEmail,byeEmail} = require('./email/account')


router.post('/users', async (req,res) => {
    
    const users = new user(req.body)
    try{
       
        await users.save()
        
        const token = await users.generateAuthToken()

        res.status(200).send({users,token})
    }
    catch(e){
        res.status(400).send(e)
    }
    
})
upload = multer({
    limits : {
        fileSize : 100000000
    },
    fileFilter(req,file,cb){
        if(!(file.originalname.match(/\.PNG$/) || file.originalname.match(/\.png$/)))
        {
            return cb(new Error('The file is not a doc'))
        }
        cb(undefined,true)
    }

})
router.post('/users/me/avatar',auth,upload.single('avatar'), async (req,res) => {
    const buffer = await sharp(req.file.buffer).resize({width : 250, height : 250}).png().toBuffer()
    req.user.avatar = buffer
    await req.user.save()
    res.send()
}, 
    (error,req,res,next) => {
        res.send({error : "Not a valid file"})
    }
)

router.get('/users/:id/avatar',async(req,res) => {
    const userss = await user.findById(req.params.id)

if(!userss || !userss.avatar){
    res.send({error :'No user or pic'})
}

res.set('Content-Type','image/png')
res.send(userss.avatar)
})

router.delete('/users/me/avatar',auth,async (req,res) => {
    req.user.avatar = undefined
    await req.user.save()
    res.send('Picture Deleted')
})
router.patch('/users/me', auth, async (req,res) => {
    const updates = Object.keys(req.body)
    const allowed = ['age','name','email','password']
    const isValid = updates.every((update) => {
        return allowed.includes(update)
    })

    if(!isValid){
        res.send({error : "Not valid"})
    }
    
    try {
        updates.forEach((update) => {
        return req.user[update] = req.body[update]
        })
        await req.user.save()
    
        res.status(200).send(req.user)
      
    }
    catch(e) {
        res.send(e)
    }
})

router.post('/users/logout', auth, async (req,res) => {
    try {
    req.user.tokens = req.user.tokens.filter((token) => {
        return token.token !== req.token
    })
    await req.user.save()
    res.status(200).send(req.user)
}
catch(e) {
    res.status(500).send('Error man')
}
})

router.post('/users/logoutAll',auth, async(req,res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token === req.token
        })
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()
        res.status(200).send(req.user)
    }
    catch(e) {
        res.status(500).send('Internal error')
    }
    
})

router.get('/users/me',auth,async(req,res) => {
    res.status(200).send(req.user)
})


router.post('/users/login', async (req,res) => {
    try {
        const USERS = await user.findByCredentials(req.body.email,req.body.password)
            const  token = await USERS.generateAuthToken()
    res.status(200).send({USERS,token})
    }
    catch(e) {
        res.status(500).send(e)
    }
    
})

router.delete('/users/me', auth, (req,res) => {
    try {
        req.user.remove()
        byeEmail(req.user.email,req.user.name)
        res.send(req.user)
    }
    catch(e) {
        res.send({error : 'Could not delete'})
    }
})

module.exports = router