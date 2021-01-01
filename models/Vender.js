const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const venderSchema = new mongoose.Schema({
    location: {
        type: { type: String },
        coordinates: []
    },
    name: {
        type: String,
        required: true
    },
    garage: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    mobile: {
        type: Number,
        required: true
    },
    pass: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    check: {
        type: String,
        required: true
    },
    orders: [{
        id: String,
        name: String,
        email: String,
        mobile: Number, 
        flag : Boolean
    }],
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
});
venderSchema.index({ location: "2dsphere" });
venderSchema.methods.order_pick = async function (id, name, email, mobile) {
    try {
        this.orders = await this.orders.concat({
            id: id,
            name: name,
            email: email,
            mobile: mobile,
            flag : false
        })
        await this.save();
        return true;
    } catch (error) {
        res.send(error);
    }
    next();
}
venderSchema.methods.generateAuthToken = async function () {
    try {
        const token = jwt.sign({ _id: this._id }, process.env.SECRETE_KEY);
        this.tokens = this.tokens.concat({ token: token });
        await this.save();
        return token;
    } catch (error) {
        res.send('The error is' + error);
    }
    next();
}


// venderSchema.pre('save' , async function(next){
//     if(this.isModified('pass')){
//         this.pass = await bcrypt.hash(this.pass , 10);
//     }
//     next();
// })
const vender_data = mongoose.model('VENDER_DATA', venderSchema);

module.exports = vender_data;