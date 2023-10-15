const { AuthenticationError } = require('apollo-server-express');
const { User } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
  Query: {
    me: async (parent, args, context) => {
      if (context.user) {
        // If there is a user in the context (i.e., the user is authenticated)
        // Fetch user data from the database based on the user's ID
        const userData = await User.findOne({ _id: context.user._id }).select('-__v -password');
        
        // Return user data, excluding '__v' and 'password' fields
        return userData;
      }
      // If there is no user in the context (i.e., the user is not authenticated)
      // Throw an AuthenticationError indicating that the user needs to be logged in
      throw new AuthenticationError('Error, You need to be logged in!');
    },
  },

  Mutation: { //This mutation adds a new user to the database.
    addUser: async (parent, args) => {
      const user = await User.create(args);
      const token = signToken(user);
      return { token, user };
    },
    login: async (parent, { email, password }) => { //This mutation handles user login and authentication.
      const user = await User.findOne({ email });

      if (!user) {
        throw new AuthenticationError('No user found');
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new AuthenticationError('Error, Incorrect password');
      }

      const token = signToken(user);

      return { token, user };
    },
    saveBook: async (parent, { newBook }, context) => { //This mutation allows an authenticated user to save a new book.
      if (context.user) {
        const updatedUser = await User.findByIdAndUpdate(
          { _id: context.user._id },
          { $push: { savedBooks: newBook }},
          { new: true }
        );
        return updatedUser;
      }
      throw new AuthenticationError(' Error, You need to be logged in!');
    },
    removeBook: async (parent, { bookId }, context) => { // This mutation allows an authenticated user to remove a saved book.
      if (context.user) {
        const updatedUser = await User.findByIdAndUpdate(
          { _id: context.user._id },
          { $pull: { savedBooks: { bookId }}},
          { new: true }
        );
        return updatedUser;
      }
      throw new AuthenticationError(' Error, You need to be logged in!');
    },
  },
};

//In summary, these mutations handle user registration, login, saving books, and removing books. They ensure authentication and perform database operations based on user actions. If a user is not authenticated, errors are thrown.

module.exports = resolvers;

/*

The me resolver fetches the authenticated user based on the context.user information. If the user is not authenticated, it throws an AuthenticationError.

*/