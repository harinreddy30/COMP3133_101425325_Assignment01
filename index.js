require("dotenv").config();
const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const cors = require("cors");
const connectDB = require("./config/db"); 
const typeDefs = require("./schema/typeDefs");
const resolvers = require("./schema/resolvers");

const app = express();
app.use(cors()); 

// Connect to MongoDB Atlas
connectDB();

// Initialize Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => ({ req }) 
});

async function startServer() {
  await server.start();
  server.applyMiddleware({ app });

  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}/graphql`));
}

startServer();
