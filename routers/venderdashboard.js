const express = require('express');
const router = express.Router();
const vender_data = require('../models/Vender')
const venderAuth = require('../middleware/venderauth');
var current_order=[];
var accepted_order=[];
router.get('/merchant' ,venderAuth ,async(req , res)=>{
    try {
        const order = req.vender.orders;
        // console.log(typeof(order));
        for(var i = 0 ; i<order.length ; i++){
            if(order[i].flag==true){
                await accepted_order.push(order[i]);
            }
            else{
                await current_order.push(order[i]);
            }
        }
        console.log(current_order.length);
        res.render('merchant' , {current_order:current_order , accepted_order : accepted_order});
        current_order.length = 0 ; 
    } catch (error) {
        res.status(400).send('error is : ' + error);
    }
})

router.get('/picked_garage/:_id', venderAuth , async (req , res)=>{
    try {
        const id = req.params._id;
        console.log(id);
        const vender = await vender_data.find({"orders._id" : id} , {orders : {$elemMatch : {_id : id} }});
        console.log(vender);
        res.send(vender);

    } catch (error) {
        res.status(400).send(error);
    }
})

module.exports = router;