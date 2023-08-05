const express = require('express');
const authControllerObj = require('../controllers/auth-controller');

const authRouter = express.Router();

authRouter.post('/signup',authControllerObj.doSignUp);

module.exports = authRouter ; 