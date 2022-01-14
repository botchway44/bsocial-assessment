const {AuthenticationError, UserInputError} = require('apollo-server')
const bcrypt = require ('bcrypt');
const jwt = require('jsonwebtoken')
var Validator = require("email-validator");
require("dotenv").config();


const secret = process.env.JWT_SECRET;
const saltRounds = 10;

const createToken = (id, email,name) =>  jwt.sign({ name: name,  email: email, id :id }, secret);

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
  if (!input.email && !input.password)  throw new UserInputError('Email and Password are required')
  if (!Validator.validate(input.email))  throw new UserInputError('Email is invalid')
 
  //TODO : Handle special characters for password
  if(input.password.trim() === '') throw new UserInputError('Password is required and cannot be empty')
  if(input.password.trim().length < 8) throw new UserInputError('Password must be at least 8 characters long')

  return next(root, {input}, context, info);
}

const verifySignUpInputs = next => (root, {input}, context, info) => {
  if (!input.email && !input.password && !input.name)  throw new UserInputError('Email and Password are required')
  if (!Validator.validate(input.email))  throw new UserInputError('Email is invalid');
  
  //TODO : Handle special characters for password
  if(input.password.trim() === '') throw new UserInputError('Password is required and cannot be empty')
  if(input.password.trim().length < 8) throw new UserInputError('Password must be at least 8 characters long')
 
  return next(root, {input}, context, info);
}


function saltPassword(password) {
    return bcrypt.hashSync(password, saltRounds);
}


function verifyUser(password, user_pass){
 return bcrypt.compareSync(password, user_pass)
}

    
module.exports = {
  saltPassword,
  getUserFromToken,
  authenticated,
  createToken,
  verifyUser,
  verifyLoginInputs,
  verifySignUpInputs
}