const User = require('../models/user')
const AuthService = require('./AuthService');

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

exports.getUserHash = async (email) => {
  const user = await this.getUser(email, '+hash');
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
    const hash = await this.getUserHash(email);
    const validPassword = await AuthService.validPassword(password, hash);
    if (!validPassword) {
      return { success: false, message: 'Authentication failed. Wrong password.' };
    } else {

      const payload = {
        email: user.email 
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