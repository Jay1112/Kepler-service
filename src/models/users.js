const mongoose = require('mongoose');

const users = 'users';

const userSchema = new mongoose.Schema({
    user_id : {
        type : String,
        require : true,
    },
    email : {
        type : String,
        require : true,
    },
    password : {
        type : String,
        require : true,
    },
    auth_state : {
        type : Number,
        require : true,
    },
    otp : {
        type : Number,
        require : false
    }
});

const userModal = new mongoose.model(users,userSchema);

module.exports = userModal ; 