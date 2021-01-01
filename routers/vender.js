const express = require('express');
const nodeGeocoder = require('node-geocoder');
const router = express.Router();
const vender_data = require('../models/Vender');

let options = {
    provider: 'openstreetmap'
};
let geoCoder = nodeGeocoder(options);

router.get('/registration', (req, res) => {
    res.render('vender_registration', { error_msg: "" });
})

router.post('/registration', async (req, res) => {
    try {
        var { name, garage, email, mobile, pass, address, city, check } = req.body;
        if (!name || !garage || !email || !mobile || !pass || !address || !city) {
            return res.render('vender_registration', { error_msg: "Please fill all the fields" });
        }
        if (!check) {
            return res.render('vender_registration', { error_msg: "Accept terms and condition for Register into the application" });
        }
        if (mobile.length != 10) {
            return res.render('vender_registration', { error_msg: "Invalid mobile number" });
        }

        if (pass.length < 6) {
            return res.render('vender_registration', { error_msg: "Password contains atleast 6 letters" });
        }

        vender_data.findOne({ email: email }, async (err, user) => {
            try {
                if (err) {
                    throw err;
                }
                if (user) {
                    console.log('Email already Exist....');
                    return res.render('vender_registration', { error_msg: "Email already exist!" });
                }
                else {

                    var obj = await geoCoder.geocode(address)
                    console.log(obj);
                    if (obj.length > 0) {
                        var lat = obj[0].latitude;
                        var lon = obj[0].longitude;
                        var point = [];
                        point.push(lon);
                        point.push(lat);
                        var q = {
                            location: {
                                type: "Point",
                                coordinates: point,
                            },
                            name, garage, email, mobile, pass, address, city, check,

                        }
                        console.log(q);
                        const ps = new vender_data(q);
                        const token = await ps.generateAuthToken();
                        res.cookie('jwt', token, {
                            expires: new Date(Date.now() + 3000000),
                            httpOnly: true
                        })
                        await ps.save(function (err) {
                            if (err) return console.error(err);
                            console.log('One item iserted successfully....');
                            return res.redirect('/login');
                        });
                    }
                    else {
                        return res.render('vender_registration', { error_msg: "Please choose a valid location" });
                    }
                }

            } catch (error) {
                res.status(400).send(error);
            }
        });
    } catch (error) {
        res.status(400).send(error);
    }

})

module.exports = router;