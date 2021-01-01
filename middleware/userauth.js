const jwt = require('jsonwebtoken');
const db = require('../models/User')
require('dotenv').config()
const userauth = async(req , res , next)=>{
    try {
        const token = req.cookies.jwt;
        const verifyUser = jwt.verify(token , process.env.SECRETE_KEY);
        const user = await db.findOne({_id : verifyUser._id});
        req.token = token ;
        req.user=user;
        next();
    } catch (error) {
        res.render('login')
    }
}
module.exports = userauth ;