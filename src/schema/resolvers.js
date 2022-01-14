const {authenticated} = require('../core/auth.js');

const resolvers = {
    Query : {
        me: authenticated((parent, args, context) => {
            return  {
                id: 1,
                email: 'john@gmail.com',
            }
        }),
    
      login: async (parent, {input}, context) => {
          const user = await context.db.findUser(input.email);
          console.log(user);
    
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