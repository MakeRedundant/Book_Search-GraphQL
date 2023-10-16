const { User } = require("../models");
const { signToken, AuthenticationError } = require("../utils/auth");

const resolvers = {
  Query: {
    // Resolver for the 'me' query. Fetches user data if authenticated.
    me: async (parent, args, context) => {
      // Check if user is authenticated using context
      if (context.user) {
        // If authenticated, return user data
        return User.findOne({ _id: context.user._id });
      }
      // If not authenticated, throw authentication error
      throw AuthenticationError;
    },
  },
  Mutation: {
    // Resolver for the 'login' mutation. Validates credentials and returns user data and token.
    login: async (parent, { email, password }) => {
      // Find user by email
      const user = await User.findOne({ email });

      // If user not found, throw authentication error
      if (!user) {
        throw AuthenticationError;
      }

      // Check if provided password is correct
      const correctPw = await user.isCorrectPassword(password);

      // If incorrect password, throw authentication error
      if (!correctPw) {
        throw AuthenticationError;
      }

      // Sign a token for the authenticated user
      const token = signToken(user);

      // Return token and user data
      return { token, user };
    },
    // Resolver for the 'addUser' mutation. Creates a new user and returns user data and token.
    addUser: async (parent, { username, email, password }) => {
      // Creates a new user
      const user = await User.create({ username, email, password });
      // Sign a token for the new user
      const token = signToken(user);
      // Return token and user data
      return { token, user };
    },
    // Resolver for the 'saveBook' mutation. Adds a new book to user's savedBooks list.
    saveBook: async (
      parent,
      { authors, description, title, bookId, image, link },
      context
    ) => {
      // Check if user is authenticated using context
      if (context.user) {
        // Add the new book to user's savedBooks list
        const user = await User.findOneAndUpdate(
          { _id: context.user._id },
          {
            $addToSet: {
              savedBooks: {
                authors,
                description,
                title,
                bookId,
                image,
                link,
              },
            },
          },
          {
            new: true,
            runValidators: true,
          }
        );
        // Return updated user data
        return user;
      }
      // If user not authenticated, throw authentication error
      throw AuthenticationError;
    },
    // Resolver for the 'removeBook' mutation. Removes a book from user's savedBooks list.
    removeBook: async (parent, { bookId }, context) => {
      // Check if user is authenticated using context
      if (context.user) {
        // Remove the specified book from user's savedBooks list
        const user = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $pull: { savedBooks: { bookId } } },
          { runValidators: true, new: true }
        );
        return user;
      }
    },
  },
};

module.exports = resolvers;
