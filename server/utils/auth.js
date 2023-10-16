const { GraphQLError } = require("graphql");
const jwt = require("jsonwebtoken");

const secret = "mysecretssshhhhhhh";
const expiration = "2h"; //expires in 2 hours?

module.exports = {
  AuthenticationError: new GraphQLError("Could not authenticate user.", {
    extensions: {
      code: "UNAUTHENTICATED",
    },
  }),
  // Exporting an AuthenticationError object, which is a custom GraphQL error with a specific error code ("UNAUTHENTICATED")
  authMiddleware: function ({ req }) {
    let token = req.body.token || req.query.token || req.headers.authorization;
    console.log(token);
    if (req.headers.authorization) {
      token = token.split(" ").pop().trim();
    }
    console.log("token" + token);
    if (!token) {
      return req;
    }

    try {
      const { data } = jwt.verify(token, secret, { maxAge: expiration });
      req.user = data;
    } catch {
      console.log("Invalid token");
    }

    return req;
  },
  signToken: function ({ email, username, _id }) {
    const payload = { email, username, _id };
    return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
  },
};

//This function takes user data (email, username, and _id) as input and creates a JWT (jsonwebtoken) token with 
//the provided payload. The token is signed using the secret and has an expiration time defined by expiration.