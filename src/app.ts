import express from 'express';
import { ApolloServer, gql } from 'apollo-server-express';

import { getAuthTwitter, getAuthCallbackTwitter } from './routes/authRoutes';

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

const app: express.Application = express();

app.set('port', process.env.PORT || 4000);

app.get('/auth/twitter', getAuthTwitter);
app.get('/auth/callback/twitter', getAuthCallbackTwitter);

gqlServer.applyMiddleware({ app });

export { app, gqlServer };
