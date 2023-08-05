const express           = require('express')            ;
const bodyParser        = require('body-parser')        ;
const cookieParser      = require('cookie-parser')      ;
const dotenv            = require('dotenv')             ;        

const doMongoConnection = require('./mongodb/mongodb')  ;
const authRouter = require('./routers/auth-router');

const app = express();

dotenv.config();

// middlewares
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

const PORT = process.env.PORT || 4000 ;

function mountAllRouters(app){
    if(!app){
        throw new Error("Express App Doesn't Exist!!");
        return ;
    }
    app.use('/api/v1/auth',authRouter);
}

// Mount All APIs
mountAllRouters(app);

// mongo db connection
doMongoConnection();

// Start Listening
app.listen(PORT,()=>{
    console.log(`Server is listening on ${PORT}`);
});