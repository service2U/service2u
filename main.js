const express = require('express')
const bodyparser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const app = express();

// connect mongoDB Database
mongoose.connect('mongodb://localhost/service2u', {useNewUrlParser:true,
useUnifiedTopology: true,
useCreateIndex:true,
useFindAndModify:false,});

// Set the template Engin directory
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/views'));

// EJS
app.set('view engine', 'ejs');

// Include the bodyParser
app.use(bodyparser.urlencoded({ extended: false }))
app.use(bodyparser.json())
app.use(cookieParser());

// Use css file on different routers 
const css = express.static(path.join(__dirname, 'style'))

// Using all routers 
app.use('/' ,css , require('./routers/home'));
app.use('/user' ,css , require('./routers/user'));
app.use('/vender' ,css , require('./routers/vender'));
app.use('/login' ,css , require('./routers/login'));
app.use('/venderdashboard' , css, require('./routers/venderdashboard'));
app.use('/userdashboard' , css , require('./routers/userdashboard'));
app.use('/address' , css , require('./routers/address'));





app.listen(3000 , ()=>{
    console.log('Application is running on port 3000');
});
