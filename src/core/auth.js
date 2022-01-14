const {AuthenticationError} = require('apollo-server')
const bcrypt = require ('bcrypt');
const jwt = require('jsonwebtoken')
var Validator = require("email-validator");

// const {models} = require('./db')

require("dotenv").config();

const secret = process.env.JWT_SECRET;
const saltRounds = 10;

const createToken = ({id, role}) => jwt.sign({id, role }, secret)

const getUserFromToken = async (token, db) => {
  try {
    const user = jwt.verify(token, secret)
    return await db.findUser(user.email);
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


const verifyLoginInputs = next => (root, {input}, context, info) => {
  if (!input.email && !input.password)  throw new AuthenticationError('Email and Password are required')
  

  if (!Validator.validate(input.email))  throw new AuthenticationError('Email is invalid')
  return next(root, {input}, context, info);
}

const verifySignUpInputs = next => (root, {input}, context, info) => {
  if (!input.email && !input.password && !input.name)  throw new AuthenticationError('Email and Password are required')
  

  if (!Validator.validate(input.email))  throw new AuthenticationError('Email is invalid');
  return next(root, {input}, context, info);
}



function JWTSign(id, email,name ) {
  return jwt.sign({ name: name,  email: email, id :id }, secret);
}


function saltPassword(password) {
    return bcrypt.hashSync(password, saltRounds);
}

function comparePassword(password, hash) {
 return  bcrypt.compareSync(password, hash)
}


function verifyUser(password, user_pass){
  console.log(`User ${user_pass} pass ${password}`)
  return comparePassword(password, user_pass)
}

    
module.exports = {
  saltPassword,
  comparePassword,
  getUserFromToken,
  authenticated,
  JWTSign,
  createToken,
  verifyUser,
  verifyLoginInputs,
  verifySignUpInputs
}