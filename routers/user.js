const express = require('express');
const router = express.Router();
const user_data = require('../models/User');


router.get('/registration', (req, res) => {
    res.render('user_registration', { error_msg: "" });
})

router.post('/registration', async (req, res) => {
    try {
        var { first, last, email, mobile, pass, pass2, check } = req.body;
        if (!first || !email || !last || !pass || !pass2 || !mobile) {
            return res.render('user_registration', { error_msg: "Please fill all the fields" });
        }
        if (!check) {
            return res.render('user_registration', { error_msg: "Accept terms and condition for Registration" });
        }
        if (pass !== pass2) {
            return res.render('user_registration', { error_msg: "Password does not match" });
        }
        if (mobile.length != 10) {
            return res.render('user_registration', { error_msg: "Invalid mobile number" });
        }
        user_data.findOne({ email: email }, async (err, user) => {
            try {
                if (err) {
                    throw err;
                }
                if (user) {
                    console.log('Email already Exist....');
                    return res.render('user_registration', { error_msg: "Email already exist!" });
                }
                else {
                    var q = { first, last, email, mobile, pass, pass2 };
                    console.log(q);
                    const ps = new user_data(q);
                    const token = await ps.generateAuthToken();
                    res.cookie('jwt', token, {
                        expires: new Date(Date.now() + 3000000),
                        httpOnly: true
                    })
                    ps.save(function (err, q) {
                        if (err) return console.error(err);
                        console.log('One item iserted successfully....');
                        return res.redirect('/login');
                    });
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