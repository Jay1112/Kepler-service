const mongoose = require('mongoose');

const otps = 'otps';

const otpSchema = new mongoose.Schema({
    user_id : {
        type : String,
        require : true,
    },
    otp : {
        type : String,
        require : true,
    }
});

const otpModal = new mongoose.model(otps,otpSchema);

module.exports = otpModal ; 