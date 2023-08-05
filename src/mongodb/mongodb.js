const mongoose = require('mongoose');

function doMongoConnection(){
    const mongo_url = process.env.MONGO_DB_URL;
    if(mongo_url){
        mongoose.connect(mongo_url)
                .then(()=>{
                    console.log('Mongo DB Connected');
                })
                .catch((err)=>{
                    console.log('Mongo DB Connection Error : ',e);
                });
    }else{
        throw new Error("Mongo : Connection string is missing in environment variables");
    }
}

module.exports = doMongoConnection;