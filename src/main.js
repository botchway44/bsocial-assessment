const { ApolloServer }  = require( 'apollo-server-express' );
const { ApolloServerPluginDrainHttpServer } = require ('apollo-server-core');
const express = require( 'express');
const http = require( 'http');
const morgan = require('morgan');
const {getUserFromToken} = require('./core/auth.js');
require("dotenv").config();

const MongoClientConnection = require("./core/mongo_client.js")
const {resolvers, typeDefs} = require('./schema/index');

async function startApolloServer(typeDefs, resolvers) {
    // Required logic for integrating with Express
    const app = express();
    app.use(morgan('dev'));

    const httpServer = http.createServer(app);
    let mongoClient = new MongoClientConnection();
    
    try{
    await mongoClient.connect(process.env.MONGODB_URL);
    }catch(e){
      // exit the program
      throw new Error("Database failed to connect");

    }
    // Same ApolloServer initialization as before, plus the drain plugin.
    const server = new ApolloServer({
     async context({req}){    
        let user = null;
        const authHeader = req.headers.authorization || null;
        if(authHeader){
        const token = authHeader.split(' ')[1];
        user = getUserFromToken(token, mongoClient);
       }
      
       return {db : mongoClient, user};
      },
      typeDefs,
      resolvers,
      introspection: process.env.NODE_ENV !== 'production',
      plugins: [ApolloServerPluginDrainHttpServer({ httpServer }),
     
    ],
    });
  
    // More required logic for integrating with Express
    await server.start();
    server.applyMiddleware({
      app,
  
      // By default, apollo-server hosts its GraphQL endpoint at the
      // server root. However, *other* Apollo Server packages host it at
      // /graphql. Optionally provide this to match apollo-server.
      path: '/'
    });
  
    // Modified server startup
    await new Promise(resolve => httpServer.listen({ port: 4000 }, resolve));
    console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);
  }

//start the apollo server
startApolloServer(typeDefs, resolvers);