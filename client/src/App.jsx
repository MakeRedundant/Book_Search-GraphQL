import "./App.css";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { Outlet } from "react-router-dom";

import Navbar from "./components/Navbar";

// Create an HTTP link to connect to the GraphQL API endpoint
const httpLink = createHttpLink({
  uri: "/graphql",
});

// Create an authentication link that adds the bearer token to the request headers
const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem("id_token");
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "", // Add the token to the authorization header if available
    },
  };
});

// Create an Apollo Client instance with the authentication link and in-memory cache
const client = new ApolloClient({
  // Set up the client to execute the `authLink` middleware prior to making requests to the GraphQL API
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

// Main App component
function App() {
  return (
    // Provide the Apollo Client instance to the entire app using ApolloProvider
    <ApolloProvider client={client}>
      {/* Render the Navbar component at the top of the app */}
      <Navbar />
      {/* Render the component corresponding to the current route using the Outlet component from React Router */}
      <Outlet />
    </ApolloProvider>
  );
}

export default App;
