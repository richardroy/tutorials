const User = require('../models/user')
const AuthService = require('./AuthService');
const Response = require('./ResponseService');

exports.getUser = async (email, customFields) => {
  const user = await User.findOne({
    email
  }).select(customFields);
  return user;
}

exports.getAllUsers = async () => {
  const users = await User.find();
  return users;
}

exports.createUser = (async (email, name, password) => {  
  const hash = AuthService.encryptPassword(password);

  var newUser = new User({ 
    email,
    name,
    hash
  });

  try{
    await newUser.save()

    console.log('User saved successfully');
    return Response.success({});
  } catch (err) {
    throw err;
  }
});

exports.authenticateUser = async (email, password) => {
  const user = await this.getUser(email, '+hash');
  if (!user) {
    return Response.error('Authentication failed. User not found.');
  } else if (user) {
    const validPassword = await AuthService.validPassword(password, user.hash);
    if (!validPassword) {
      return Response.error('Authentication failed. Wrong password.');
    } else {
      const payload = {
        email: user.email 
      };
      var token = AuthService.generateJwtToken(payload);

      return Response.success({
        message: 'Enjoy your token!',
        token
      })
    };
  }

};