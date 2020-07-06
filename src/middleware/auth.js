const jwt = require('jsonwebtoken')
const user = require('../models/users')

const auth = async(req,res,next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '')
    const verification = jwt.verify(token,process.env.JWT_SECRET)
    const userss = await user.findOne({'_id' : verification._id, 'tokens.token' : token})
    if(!userss){
        throw new Error()
    }
    req.user = userss
    req.token = token
    next()
    }
    catch(e) {
        res.send('Error Occured')
    }
}
module.exports = auth