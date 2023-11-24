const express= require('express');

const articleRoute = require('./routes/article');

const authorRoute = require('./routes/author');

require('./config/connect');

const app = express();

const cors = require('cors');

app.use( cors() );

app.use( express.json() );

app.use( '/article' , articleRoute );

app.use( '/author' , authorRoute );

app.use( '/getimage' , express.static('./uploads') );

app.use(express.static('./angular'));

const PORT = process.env.PORT || 3000;
app.listen( PORT , ()=>{
    console.log('server work');
})