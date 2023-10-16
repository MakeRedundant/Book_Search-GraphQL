const express = require("express");
const path = require("path");

const { ApolloServer } = require("@apollo/server");
const { expressMiddleware } = require("@apollo/server/express4");

const { authMiddleware } = require("./utils/auth");

const { typeDefs, resolvers } = require("./schemas");
const db = require("./config/connection");

const PORT = process.env.PORT || 3001;
const app = express();
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

/*
Create a instance of Apollo Server
typeDefs: This is the type definition for your GraphQL schema. It defines the shape of your API, including types (objects), queries (read operations), mutations (write operations), and subscriptions 
resolvers: Resolvers are functions that define how to fetch the data for each type and field specified in the schema. They provide the instructions for turning a GraphQL operation into data.
context: authMiddleware: The context option allows you to pass in a context object to your resolvers. In this case, authMiddleware is being used as the context.
The context object can hold authentication information, database connections, and other shared data that your resolvers might need.
*/

const startApolloServer = async () => {
  await server.start();

  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  app.use(
    "/graphql",
    expressMiddleware(server, {
      context: authMiddleware,
    })
  );

  // if we're in production, serve client/dist as static assets
  if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../client/dist"))); //dist for distrubted

    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "../client/dist/index.html"));
    });
  }

/*
This code ensures that when the server is running in production mode (NODE_ENV set to 'production'), it serves the static assets from the client/dist directory.
 
app.get(*) sets up a route handeler for all HTTP Get requests that doesnt match any specific routes defined in your server.
* is a wild card that matches any path

res.sendFile(path.join(__dirname, "../client/dist/index.html")): This line of code sends the index.html file as the response for any unmatched route

In summary, this route handler ensures that for any URL requested on the server that doesn't match an explicitly defined route (typically used for API endpoints),
the server sends the index.html file, 
*/

  db.once("open", () => {
    app.listen(PORT, () => {
      console.log(`API server running on port ${PORT}!`);
      console.log(`Use GraphQL at http://localhost:${PORT}/graphql`);
    });
  });
};

//This server uses Express.js and Apollo Server for GraphQL functionality.
/*
It includes Apollo Server middleware for handling GraphQL requests.
It uses Apollo Server's context to implement authentication middleware (authMiddleware).
In production, it serves the React frontend (located in ../client/dist) as static assets.

*/



startApolloServer();
