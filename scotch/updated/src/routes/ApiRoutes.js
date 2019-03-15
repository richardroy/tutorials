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
  const username = req.body ? req.body.username : '';
  const password = req.body ? req.body.password : '';
  const response = await UserService.authenticateUser(username, password);
  res.json(response);
});

//Verify the token
apiRoutes.use( (req, res, next) => {

  const authHeader = req.headers['authorization'] || "";
  const token = AuthService.getJwtTokenFromHeader(authHeader);

  if (token) {
    const decodedToken = AuthService.validateJwtToken(token);
    if(decodedToken) {
      req.token = decodedToken
      next();
    } else {
      res.json(
        ResponseService.error('Failed to authenticate token.')
      );
    }
  } else {
    res.json(
      ResponseService.error('No Token provided.')
    );
  }
});

// route to return all users (GET http://localhost:8080/api/users)
apiRoutes.get('/users', async (req, res) => {
  const users = await UserService.getAllUsers()
  res.json(users);
});

module.exports = apiRoutes;