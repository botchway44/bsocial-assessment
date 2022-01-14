const {createToken,authenticated, verifyUser, verifyLoginInputs, verifySignUpInputs} = require('../core/auth.js');
const {AuthenticationError} = require('apollo-server')
const User = require('../models/user.js');
const resolvers = {
    Query : {        
        me: authenticated( async (parent, args, {db, user}) => {
            return user
        }),
    
      login: verifyLoginInputs( async (parent, {input}, context) => {
        const user = await context.db.findUser(input.email);
        const newUser = User.fromModel(user);

        //Thro error if user not found
        if (!user) throw new AuthenticationError('Email or Password is invalid');
        if(!verifyUser(input.password, user.password)) throw new AuthenticationError('Email or Password is invalid');

        return user;
      }),
    },

    Mutation : {
        signup: verifySignUpInputs((parent, {input}, {db}, info) => {
            return input
        }),
    },

    User: {
        id : (parent, _, __, ___) =>{
            return parent["_id"]
        },
        token: (parent, args, {db}, info) =>{
            console.log("In User token ", parent)
            const {_id, name, email} = parent;
            return createToken( _id, email, name)
        }
    }

};

module.exports = {resolvers};