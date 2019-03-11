const User = require('../models/user')
const AuthService = require('./AuthService');

exports.getUser = async (email) => {
  const user = await User.findOne({
    email
  });

  return user;
}

exports.getUserHash = async (email) => {
  const user = this.getUser(email);
  return user.hash;
}

exports.createUser = (async (email, name, password) => {  
  const encryptCredentials = AuthService.encryptPassword(password);

  var newUser = new User({ 
    email,
    name,
    hash: encryptCredentials.hash
  });

  try{
    await newUser.save()

    console.log('User saved successfully');
    return({ success: true });
  } catch (err) {
    throw err;
  }
});

exports.loginUser = (email, password) => {
  const hash = this.getUserHash(email);
  const loggedIn = AuthService.validPassword(password, hash);
}

exports.authenticateUser = async (email, password) => {
  let user = null;

  try {
    user = await this.getUser(email);
  } catch (err) {
    throw err;
  }

  if (!user) {
    return { success: false, message: 'Authentication failed. User not found.' };
  } else if (user) {

    if (!AuthService.validPassword(password, user.hash)) {
      return { success: false, message: 'Authentication failed. Wrong password.' };
    } else {

      const payload = {
        admin: user.admin     
      };

      var token = AuthService.generateJwtToken(payload);

      return {
        success: true,
        message: 'Enjoy your token!',
        token: token
      };
    } 
  }

};