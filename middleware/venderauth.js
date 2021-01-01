const jwt = require('jsonwebtoken');
const db = require('../models/Vender')
require('dotenv').config()
const venderauth = async(req , res , next)=>{
    try {
        const token = req.cookies.jwt;
        const verifyUser = jwt.verify(token , process.env.SECRETE_KEY);
        const vender = await db.findOne({_id : verifyUser._id});
        req.token = token ;
        req.vender = vender;
        next();
    } catch (error) {
        res.render('login')
    }
}
module.exports = venderauth ;