import express from 'express';
import http from 'http';
import { createHandler } from 'graphql-http/lib/use/express';
import { WebSocketServer } from 'ws';
import { useServer } from 'graphql-ws/use/ws';
import { ruruHTML } from 'ruru/server';
import schema from './schema.js'; // Import your GraphQL schema

// 2. Create Express app and add your existing HTTP GraphQL endpoint
const app = express();

app.all(
  '/graphql',
  createHandler({ // graphql-http middleware
    schema: schema,
  }),
);

app.get('/', (_req, res) => {
  res.type('html');
  res.end(ruruHTML({ endpoint: '/graphql' })); // graphiql playground
});

// 3. Create HTTP server from Express app
const server = http.createServer(app);

// 4. Create WebSocket server on the same HTTP server, same path as HTTP GraphQL endpoint
const wsServer = new WebSocketServer({ // ws
  server,
  path: '/graphql',
});

// 5. Integrate graphql-ws with WebSocket server
useServer({ schema }, wsServer);

// 6. Start the server
const PORT = 4000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}/graphql`);
  console.log(`Subscriptions ready at ws://localhost:${PORT}/graphql`);
});
