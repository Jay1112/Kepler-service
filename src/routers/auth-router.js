const express = require('express');
const authControllerObj = require('../controllers/auth-controller');

const authRouter = express.Router();

authRouter.post('/signup',authControllerObj.doSignUp);
authRouter.post('/verify',authControllerObj.verifyEmail);

module.exports = authRouter ; 