require("dotenv").config();
const { ApolloServer } = require("apollo-server-micro");
const typeDefs = require("../schema/typeDefs");
const resolvers = require("../schema/resolvers");
const connectDB = require("../config/db");

// Connect to MongoDB Atlas
connectDB();

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => ({ req }),
});

const startServer = apolloServer.start();

module.exports = async function handler(req, res) {
  // Handle pre-flight CORS requests
  if (req.method === "OPTIONS") {
    res.end();
    return;
  }
  await startServer;
  // Use "/" since the function is mounted at /api/graphql already
  return apolloServer.createHandler({ path: "/" })(req, res);
};

module.exports.config = {
  api: {
    bodyParser: false,
  },
};
