var jwt    = require('jsonwebtoken'); // used to create, sign, and verify tokens

const bcrypt = require('bcrypt');
const saltRounds = 10;

exports.encryptPassword = (password) => {
  const salt = bcrypt.genSaltSync(saltRounds);
  const hash = bcrypt.hashSync(password, salt);

  return hash;
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
  let decodedToken = null;
  try {
    decodedToken = jwt.verify(token, process.env.JWT_SECRET);
  } finally {
    return decodedToken;
  }
}

exports.getJwtTokenFromHeader = (authHeader) => {
  let authorization = authHeader.split(' ');
  if (authorization[0] !== 'Bearer') {
      throw new Error('Authorization token does not exist');
  } else {
    return authorization[1];
  }
}