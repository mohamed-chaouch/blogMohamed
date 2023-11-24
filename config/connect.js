const mongoose = require('mongoose');

const MONGODB_CONNECT_URI= process.env.MONGODB_CONNECT_URI || "mongodb+srv://blog:blog@cluster0.oaggve9.mongodb.net/blog?retryWrites=true&w=majority";

mongoose.connect(MONGODB_CONNECT_URI)
    .then(
        ()=>{
            console.log('connected successfully');
        }
    )
    .catch(
        (err)=>{
            console.log(err);
        }
    )
    
module.exports = mongoose;
