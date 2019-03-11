// =======================
// get the packages we need ============
// =======================
var express     = require('express');
var app         = express();
var bodyParser  = require('body-parser');
var morgan      = require('morgan');
var mongoose    = require('mongoose');

var config = require('./config'); // get our config file
var User   = require('./src/models/user'); // get our mongoose model

const UserService = require('./src/services/UserService')
const AuthService = require('./src/services/AuthService')

// =======================
// configuration =========
// =======================
var port = process.env.PORT || 8080; // used to create, sign, and verify tokens
mongoose.connect(config.database); // connect to database

// use body parser so we can get info from POST and/or URL parameters
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// use morgan to log requests to the console
app.use(morgan('dev'));

// =======================
// routes ================
// =======================
// basic route
app.get('/', function(req, res) {
    res.send('Hello! The API is at http://localhost:' + port + '/api');
});

// API ROUTES -------------------

// get an instance of the router for api routes
var apiRoutes = express.Router(); 

app.post('/user', async (req, res) => {
  const response = await UserService.createUser(req.body.email, req.body.name, req.body.password);
  res.json(response);
});

app.post('/login', async (req, res) => {
  const respone = await AuthService.login(req.body.email, req.body.password);
  res.json(response);
})

// route to authenticate a user (POST http://localhost:8080/api/authenticate)
apiRoutes.post('/authenticate', async (req, res) => {
  const response = await UserService.authenticateUser(req.body.email, req.body.password);
  res.json(response);
});

// route middleware to verify a token
apiRoutes.use(function(req, res, next) {

  // check header or url parameters or post parameters for token
  var token = req.body.token || req.query.token || req.headers['x-access-token'];

  // decode token
  if (token) {
    const response = AuthService.validateJwtToken(token);
    if(response.success) {
      req.decoded = response.decoded
      next();
    } else {
      res.json(response);
    }
  } else {
    return res.status(403).send({ 
        success: false, 
        message: 'No token provided.' 
    });
  }
});

// route to show a random message (GET http://localhost:8080/api/)
apiRoutes.get('/', function(req, res) {
  res.json({ message: 'Welcome to the coolest API on earth!' });
});

// route to return all users (GET http://localhost:8080/api/users)
apiRoutes.get('/users', function(req, res) {
  User.find({}, function(err, users) {
    res.json(users);
  });
});
 
// apply the routes to our application with the prefix /api
app.use('/api', apiRoutes);

// =======================
// start the server ======
// =======================
app.listen(port);
console.log('Magic happens at http://localhost:' + port);
