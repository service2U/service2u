const express  = require('express');
const router = express.Router();

router.get('/user' , (req , res)=>{
    res.render('user' , {data:""});
})

module.exports = router;