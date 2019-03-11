var express     = require('express');
var app         = express();
var bodyParser  = require('body-parser');
var morgan      = require('morgan');
var mongoose    = require('mongoose');

require('dotenv').config()

const apiRoutes = require('./src/routes/ApiRoutes')
var port = process.env.PORT || 8080;
mongoose.connect(process.env.MONGODB_DATABASE_URL); 

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(morgan('dev'));

app.use('/api', apiRoutes);

app.get('/', (req, res) => {
    res.send('Hello! The API is at http://localhost:' + port + '/api');
});

app.listen(port);

console.log('Magic happens at http://localhost:' + port);
