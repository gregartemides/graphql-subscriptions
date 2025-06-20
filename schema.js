import { GraphQLObjectType, GraphQLSchema, GraphQLInt, GraphQLString } from 'graphql';
import { PubSub } from 'graphql-subscriptions';
 
const pubsub = new PubSub();

// Query type (required even if empty)
const QueryType = new GraphQLObjectType({
  name: 'Query',
  fields: {
    hello: { type: GraphQLInt, resolve: () => 42 }, // Example query
  },
});

const MutationType = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    sendMessage: {
      type: GraphQLString,
      args: {
        message: { type: GraphQLString },
      },
      resolve: (_, { message }) => {
        pubsub.publish('MESSAGE_SENT', { messageSent: message });
        return message;
      },
    },
  },
});

// Subscription type (fixed)
const SubscriptionType = new GraphQLObjectType({
  name: 'Subscription',
  fields: {
    messageSent: {
      type: GraphQLString,
      subscribe: () => pubsub.asyncIterableIterator(['MESSAGE_SENT']),
    },
  },
});

// Schema
const schema = new GraphQLSchema({
  query: QueryType,
  subscription: SubscriptionType,
  mutation: MutationType,
});


export default schema;
