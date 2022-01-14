const { ApolloServer }  = require( 'apollo-server-express' );
const { ApolloServerPluginDrainHttpServer } = require ('apollo-server-core');
const express = require( 'express');
const http = require( 'http');
const morgan = require('morgan');
require("dotenv").config();

const MongoClientConnection = require("./core/mongo_client.js")

const {resolvers, typeDefs} = require('./schema/index');
const { exit } = require('process');

async function startApolloServer(typeDefs, resolvers) {
    // Required logic for integrating with Express
    const app = express();
    app.use(morgan('dev'));

    const httpServer = http.createServer(app);
    let mongoClient = new MongoClientConnection();
    
    try{
    await mongoClient.connect(process.env.MONGODB_URL);
    }catch(e){
      throw new Error("Database failed to connect");
      // exit the program
      process.exit(1);

    }
    // Same ApolloServer initialization as before, plus the drain plugin.
    const server = new ApolloServer({
     async context({req}){    
        const token = req.headers.authorization
        const user = getUserFromToken(token)

         return {db : mongoClient, user};
      },
      typeDefs,
      resolvers,
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