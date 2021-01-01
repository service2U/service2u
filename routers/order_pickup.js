const express = require('express');
const router = express.Router();
const vender_data = require('../models/Vender');

router.get('/order_pickup/:id/:email' , (req , res)=>{
    const id = req.params.id;
    const email = req.params.email;
    vender_data.update({_id:id} ,{$push: {list : email}} , done);
    res.render('')
})

module.exports = router;