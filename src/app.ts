import express from 'express';
import { ApolloServer, gql } from 'apollo-server-express';

const typeDefs = gql`
  type Query {
    hello: String
  }
`;

const resolvers = {
  Query: {
    hello: (): string => 'Hello World',
  },
};

const gqlServer = new ApolloServer({ typeDefs, resolvers });

const app = express();

app.set('port', process.env.PORT || 4000);

gqlServer.applyMiddleware({ app });

export { app, gqlServer };
