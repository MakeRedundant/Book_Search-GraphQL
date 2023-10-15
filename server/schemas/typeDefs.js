const { gql } = require('apollo-server-express');
//statement imports the Apollo Server library for Express.
// The gql object is destructured from the imported package.
const typeDefs = gql`
  type User {
    _id: ID!
    username: String!
    email: String!
    password: String
    bookCount: Int
    savedBooks: [Book]
  }

  type Auth {
    token: ID!
    user: User
  }

  type Book {
    bookId: ID!
    authors: [String]
    description: String
    title: String
    image: String
    link: String
  }

  input InputBook {
    bookId: String
    authors: [String]
    title: String
    description: String
    image: String
    link: String
  }

  type Query {
    me: User
  }

  type Mutation {
    login(email: String!, password: String!): Auth
    addUser(username: String!, email: String!, password: String!): Auth
    saveBook(newBook: InputBook!): User
    removeBook(bookId: ID!): User
  }
`;

module.exports = typeDefs;

//Mutation defines several mutation fields for actions like login, addUser, saveBook, and removeBook.