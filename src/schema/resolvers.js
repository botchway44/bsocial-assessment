const {
    verifySignUpInputs,
    verifyLoginInputs,
    authenticated,
    saltPassword,
    createToken,
    verifyUser,
} = require('../core/auth.js');
const {AuthenticationError} = require('apollo-server')


const resolvers = {
    Query : {        
        me: authenticated( async (parent, args, {db, user}) => {
            return user
        }),
    
      login: verifyLoginInputs( async (parent, {input}, context) => {
        const user = await context.db.findUser(input.email);

        //Thro error if user not found
        if (!user) throw new AuthenticationError('Email or Password is invalid');
        if(!verifyUser(input.password, user.password)) throw new AuthenticationError('Email or Password is invalid');

        return user;
      }),
    },

    Mutation : {
        signup: verifySignUpInputs( async (parent, {input}, {db}, info) => {
            const _user = await db.findUser(input.email);

            if(_user) throw new AuthenticationError('Email already exists');

            //add user to db addUser(email, password, name) 
            try {
                const saltedPassword = saltPassword(input.password);
                await db.addUser(input.email, saltedPassword, input.name);
            } catch (e) {
                throw new Error("Account creation failed, please try again");
             }

            const user = await db.findUser(input.email);

            return user;
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