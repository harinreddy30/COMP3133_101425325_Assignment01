// File: /api/graphql.js

require("dotenv").config();
const { ApolloServer } = require("apollo-server-micro");
const typeDefs = require("../schema/typeDefs");
const resolvers = require("../schema/resolvers");

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => ({ req }),
});

const startServer = apolloServer.start();

module.exports = async function handler(req, res) {
  // Allow pre-flight OPTIONS requests
  if (req.method === "OPTIONS") {
    res.end();
    return false;
  }
  await startServer;
  await apolloServer.createHandler({ path: "/api/graphql" })(req, res);
};

module.exports.config = {
  api: {
    bodyParser: false,
  },
};
