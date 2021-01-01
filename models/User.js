const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const userSchema = new mongoose.Schema({
    first: {
        type:String, 
        required:true
    },
    last: {
        type:String , 
        required:true
    },
    email: {
        type:String,
        required:true,
        unique:true
    },
    mobile: {
        type:Number,
        required:true
    },
    pass: {
        type:String,
        required:true
    },
    tokens:[{
        token:{
            type:String,
            required:true
        }
    }]
});

userSchema.methods.generateAuthToken = async function(){
    try {
        const token = await jwt.sign({_id : this._id} , process.env.SECRETE_KEY);
        this.tokens = await this.tokens.concat({token : token});
        await this.save();
        return token ;
    } catch (error) { 
        res.send('The error is' + error);
    }
    next();
}


// userSchema.pre('save' , async function(next){
//     if(this.isModified('pass')){
//         this.pass = await bcrypt.hash(this.pass , 10);
//     }
//     next();
// })
const user_data = mongoose.model('USER_DATA', userSchema);
module.exports = user_data;