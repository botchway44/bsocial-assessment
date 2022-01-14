const { ApolloServerPluginDrainHttpServer, ApolloServerPluginLandingPageGraphQLPlayground ,ApolloServerPluginLandingPageLocalDefault} = require ('apollo-server-core');
const { ApolloServer }  = require( 'apollo-server-express' );
const rateLimit  =  require('express-rate-limit');
const express = require( 'express');

const http = require( 'http');
const morgan = require('morgan');
const helmet  = require('helmet');

const {getUserFromToken} = require('./core/auth.js');
require("dotenv").config();

const MongoClientConnection = require("./core/mongo_client.js")
const {resolvers, typeDefs} = require('./schema/index');
const PORT = process.env.PORT || 4000;

async function startApolloServer(typeDefs, resolvers) {
    // Required logic for integrating with Express
    const app = express();
    app.enable('trust proxy');
    // app.use(helmet()); 
    app.use(morgan('dev'));
    app.use(rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // limit each IP to 100 requests per windowMs
    }));

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
      introspection:true, //process.env.NODE_ENV !== 'production',
      playground: true,   // Introspection and playground is enabled to allo us view the playground in production for testing
      //Todo : disable this in real production app

      plugins: [
        ApolloServerPluginDrainHttpServer({ httpServer }),
    ],
    });
  
    await server.start();
    server.applyMiddleware({
      app,
      path: '/'
    });
  
    // Modified server startup
    await new Promise(resolve => httpServer.listen({ port: PORT }, resolve));
    console.log(`🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`);
  }

//start the apollo server
startApolloServer(typeDefs, resolvers);