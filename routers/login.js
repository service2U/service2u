const express = require('express');
const router = express.Router();
const user_data = require('../models/User');
const vender_data = require('../models/Vender');

router.get('/', (req, res) => {
    res.render('login', { error_msg: "" });
})
router.post('/',(req, res) => {
    let { email, pass, check } = req.body;
    if (!email || !pass) {
        return res.render('login', { error_msg: "Please fill all the fields" });
    }
    if (!check) {
        return res.render('login', { error_msg: "Accept terms and conditions for login into application" });
    }
    vender_data.findOne({ email: email }, async (err, user) => {
        try {
            if (err) {
                throw err;
            }
            if (user) {
                if (user.pass === pass) {
                    const token = await user.generateAuthToken();
                    await res.cookie('jwt', token, {
                        expires: new Date(Date.now() + 3000000),
                        httpOnly: true
                    })
                    return res.redirect('/venderdashboard/merchant');
                }
                else {
                    return res.render('login', { error_msg: "Incorrect Email or Password" })
                }
            }
            else {
                user_data.findOne({ email: email }, async (err, user) => {
                    if (err) {
                        throw err;
                    }
                    if (user) {
                        const token = await user.generateAuthToken();
                        await res.cookie('jwt', token, {
                        expires: new Date(Date.now() + 3000000),
                        httpOnly: true
                    })
                        return res.redirect('/userdashboard/user');
                    }
                    else {
                        return res.render('login', { error_msg: "Incorrect Email Or Password" });
                    }
                })
            }
        } catch (error) {
            res.status(400).send(error);
        }
        
    })
})


module.exports = router;