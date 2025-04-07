const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const connectDB = require('../config/db');
const typeDefs = require('../graphql/typeDefs');
const resolvers = require('../graphql/resolvers');
const cors = require('cors');
const serverless = require('serverless-http');

const app = express();

// Configure CORS
app.use(cors({
  origin: '*',
  credentials: true,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Connect to MongoDB
connectDB().catch(err => console.error('MongoDB connection error:', err));

// Create Apollo Server instance
const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => ({ req }),
  introspection: true,
  playground: true,
});

// This variable will hold the wrapped Express app handler after initialization.
let wrappedHandler;

// Create an initialization function that starts Apollo Server and applies its middleware.
const initApolloServer = async () => {
  await apolloServer.start();
  // Mount on '/' because the vercel route rewrites '/graphql' to your function,
  // so the incoming request’s URL becomes '/'.
  apolloServer.applyMiddleware({
    app,
    path: '/', 
    cors: false, // Disable Apollo's CORS since we're using Express CORS
  });
  // Once our Express app is fully set up, wrap it with serverless-http.
  wrappedHandler = serverless(app);
};

// Begin initialization on cold start.
const initPromise = initApolloServer();

// Export the handler function for Vercel.
module.exports = async (req, res) => {
  // Ensure initialization is complete before handling any request.
  await initPromise;
  return wrappedHandler(req, res);
};
