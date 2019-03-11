const express     = require('express');

const AuthService = require('../services/AuthService')
const UserService = require('../services/UserService')

const apiRoutes = express.Router(); 

// route to show a random message (GET http://localhost:8080/api/)
apiRoutes.get('/', (req, res) => {
  res.json({ message: 'Welcome to the coolest API on earth!' });
});

apiRoutes.post('/user', async (req, res) => {
  const response = await UserService.createUser(req.body.email, req.body.name, req.body.password);
  res.json(response);
});

// route to authenticate a user (POST http://localhost:8080/api/authenticate)
apiRoutes.post('/authenticate', async (req, res) => {
  const email = req.body ? req.body.email : '';
  const password = req.body ? req.body.password : '';
  const response = await UserService.authenticateUser(email, password);
  res.json(response);
});

// route middleware to verify a token
apiRoutes.use( (req, res, next) => {

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

// route to return all users (GET http://localhost:8080/api/users)
apiRoutes.get('/users', async (req, res) => {
  const users = await UserService.getAllUsers()
  res.json(users);
});

module.exports = apiRoutes;