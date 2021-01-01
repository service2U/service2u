const express = require('express');
const nodeGeocoder = require('node-geocoder');
const path = require('path');
const router = express.Router();

const vender_data = require('../models/Vender');
const distance = require('../math/math');
const userAuth = require('../middleware/userauth');
const css = express.static(path.join(__dirname, 'style'))
let options = {
    provider: 'openstreetmap'
};
let geoCoder = nodeGeocoder(options);

var data = [];
router.post('/' , async (req , res)=>{
    try {
        var search_location = req.body.search_location;
        var search_garage = req.body.search_garage;
        const obj = await geoCoder.geocode(search_location);
        if (obj.length > 0) {
            var lon = obj[0].longitude;
            var lat = obj[0].latitude;


            await vender_data.find({
                location: {
                    $near: {
                        $maxDistance: 3000456,//meters
                        $geometry: {
                            type: "Point",
                            coordinates: [lon, lat]
                        }
                    }
                }
            }).find((error, results) => {
                if (error) console.log(error);
                console.log(results);
                for (var len = 0; len < results.length; len++) {
                    var id = results[len]._id;
                    var lat1 = results[len].location.coordinates[1];
                    var lon1 = results[len].location.coordinates[0];
                    var dist = distance(lat, lon, lat1, lon1, 'K');
                    var name = results[len].name;
                    var garage = results[len].garage;
                    var mobile = results[len].mobile;
                    var p = { id, name, garage, mobile, dist }
                    if(!data.includes(p))
                        data.push(p);
                }
            });
        }
        await vender_data.findOne({ garage: search_garage }, (err, user) => {
            if (err) throw err;
            if (user) {
                var id = user._id;
                var name = user.name;
                var garage = user.garage;
                var mobile = user.mobile;
                var dist = '----';
                var p = { id, name, garage, mobile, dist }
                if (!data.includes(p)) {
                    data.push(p);
                }
            }
        })
        res.render('user', { data: data });
    } catch (error) {
        res.status(400).send(error);
    }
})

router.get('/order_pickup/:id', userAuth , async(req , res)=>{
    try {
        const id = req.params.id;
        console.log(id);
        const name = req.user.first + req.user.last; 
        console.log(req.user);
        var index = -1 ;
        for(var i = 0 ; i< data.length ; i++){
            if(data[i].id==id){
                index = i ;
                const vender = await vender_data.findOne({_id : id});
                const pick = await vender.order_pick(req.user._id , name , req.user.email , req.user.mobile);
                console.log(pick);
                break;
            }
        }
        if(index!=-1){
            data.splice(index , 1);
            res.render('user' , {data : data});
        }
        else{
            res.send('Data does not exist !');
        }
    } catch (error) {
        res.status(400).send(error);
    }
})

module.exports = router;
