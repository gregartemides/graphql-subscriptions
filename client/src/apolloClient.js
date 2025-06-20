// apolloClient.js
import { ApolloClient, InMemoryCache, HttpLink, split } from '@apollo/client';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';
import { getMainDefinition } from '@apollo/client/utilities';

// HTTP connection for queries and mutations
const httpLink = new HttpLink({
  uri: 'http://localhost:4000/graphql',
});

// WebSocket link for subscriptions
const wsLink = typeof window !== 'undefined' ? new GraphQLWsLink(createClient({
  url: 'ws://localhost:4000/graphql',
})) : null;

// Use split to send data to each link depending on operation type
const splitLink = typeof window !== 'undefined' && wsLink != null ? split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  httpLink,
) : httpLink;

// Create Apollo Client instance
const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
});

export default client;
