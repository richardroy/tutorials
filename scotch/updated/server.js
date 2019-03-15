var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var morgan = require('morgan');
var mongoose = require('mongoose');

require('dotenv').config()

const apiRoutes = require('./src/routes/ApiRoutes')
var port = process.env.PORT || 8080;
mongoose.connect(process.env.MONGODB_DATABASE_URL); 

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS");
    if (req.method === "OPTIONS") {
        return res.status(200).end();
    }
    next();
  });  

app.use(morgan('dev'));

app.use('/api', apiRoutes);

app.get('/', (req, res) => {
    res.json({message: 'Hello! The API is at http://localhost:' + port + '/api'});
});

app.listen(port);

console.log('Magic happens at http://localhost:' + port);
