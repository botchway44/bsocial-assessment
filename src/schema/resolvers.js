const {authenticated, verifyUser} = require('../core/auth.js');
const {AuthenticationError} = require('apollo-server')

const resolvers = {
    Query : {
        me: authenticated( async (parent, args, context) => {
            const user = await context.db.findUser(context.user.email);

            return user
        }),
    
      login: async (parent, {input}, context) => {
        const user = await context.db.findUser(input.email);
        console.log(input);
       
        //validate inputs before proceeding
        
        //Thro error if user not found
        if (!user) throw new AuthenticationError('Email or Password is invalid');
        if(!verifyUser(input.password, user.password)) throw new AuthenticationError('Email or Password is invalid');

        return {
            id: 1,
            email: 'john@gmail.com',
        }
      },
    },

    Mutation : {
        signup: (parent, {data}, {db}, info) => {
            return data
        }
    }

};

module.exports = {resolvers};