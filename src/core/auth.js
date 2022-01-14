const {AuthenticationError} = require('apollo-server')

const jwt = require('jsonwebtoken')
// const {models} = require('./db')
require("dotenv").config();

const secret = process.env.JWT_SECRET;

const createToken = ({id, role}) => jwt.sign({id, role }, secret)

const getUserFromToken = token => {
  try {
    const user = jwt.verify(token, secret)
    // return models.User.findOne({id: user.id})
  } catch (e) {
    return null
  }

}

const authenticated = next => (root, args, context, info) => {
  if (!context.user) {
    throw new AuthenticationError('must authenticate')
  }

  return next(root, args, context, info)
}

function JWTSign(id, email,name ) {
  return jwt.sign({ name: name,  email: email, id :id }, secret);
}


module.exports = {
  getUserFromToken,
  authenticated,
  JWTSign,
  createToken
}