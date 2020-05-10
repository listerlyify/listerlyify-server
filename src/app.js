const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');

const typeDefs = gql`
  type Query {
    hello: String
  }
`;

const resolvers = {
  Query: {
    hello: () => 'Hello World',
  },
};

const gqlServer = new ApolloServer({ typeDefs, resolvers });

const app = express();

app.set('port', process.env.PORT || 4000);

gqlServer.applyMiddleware({ app });

module.exports = {
  app,
  gqlServer
};
