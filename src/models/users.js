const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Task = require('../models/tasks')
const userSchema = new mongoose.Schema({

    name : {
        type : String,
        required : true,
        trim : true,
        unique : true,
        lowercase : true
    },
    age : {
        type : Number,
        default : 0
    },
    email : {
        type : String,
        required : true,
        unique : true,
        trim : true,
        validate(value) {
            if(!validator.isEmail(value)){
                throw new Error('Email not valid')
            }
        }
    },
    password : {
        type : String,
        required : true,
        trim : true,
        validate(value){
            if(value.length <= 6 ){
                throw new Error('Length should be greater than 6')
            }
            if(value.toLowerCase().includes('password')){
                throw new Error('Password should not be password')
            }
        }
    },
    tokens : [{
        token : {
            type : String,
            required : true
        }
    }],
    avatar : {
        type : Buffer
    }
},

    {
        timestamps : true
    }

)

userSchema.methods.generateAuthToken = async function() {
    const userss = this
    const token = await jwt.sign({ _id : userss._id.toString()}, process.env.JWT_SECRET)
    userss.tokens =  userss.tokens.concat({token})
    await userss.save()
    return token
}

userSchema.methods.toJSON = function() {
    const userss = this
    const userObject = userss.toObject()
    delete userObject.password
    delete userObject.tokens
    delete userObject.avatar
    return userObject
}

userSchema.statics.findByCredentials = async (email,password) => {
       
        const userss = await user.findOne({email})
        if(!userss) {
            throw new Error('Unable to Login')
        }
        const isMatch = await bcrypt.compare(password,userss.password)
        if(!isMatch){
            throw new Error('Unable to Login')
        }
        return userss
}


userSchema.pre('save', async function(next) {
    const users = this
    if(users.isModified('password')){
        users.password = await bcrypt.hash(users.password , 8)
    }
    next()
})

userSchema.virtual('taskd', {
    ref : 'task',
    localField : '_id',
    foreignField : 'owner'
})

userSchema.pre('remove', async function(next) {
    const userss = this
    await Task.deleteMany({owner : userss._id})
    next()

})

const user = mongoose.model('user',  userSchema)

module.exports = user
        