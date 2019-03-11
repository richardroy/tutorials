var jwt    = require('jsonwebtoken'); // used to create, sign, and verify tokens

const bcrypt = require('bcrypt');
const saltRounds = 10;

exports.encryptPassword = (password) => {
  const salt = bcrypt.genSaltSync(saltRounds);
  const hash = bcrypt.hashSync(password, salt);

  return {salt, hash};
}

exports.validPassword = (password, hash) => {
  const validPassword = bcrypt.compareSync(password, hash);
  return validPassword;
}

exports.generateJwtToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: 60*60*24 // expires in 24 hours
  });
}

exports.validateJwtToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoded)
    return { success: true, decoded } 
  } catch(err) {
    return { success: false, message: 'Failed to authenticate token.' };
  }
}