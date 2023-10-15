const typeDefs = `
  type User {
    _id: ID!
    username: String
    email: String
    password: String
    savedBooks: [Book]
    bookCount: Int
  }

  type Book {
    bookId: String
    authors: [String]!
    description: String
    title: String
    image: String
    link: String
  }

  type Auth {
    token: ID!
    user: User
  }

  type Query {
    me: User
  }

  type Mutation {
    login(email: String!, password: String!): Auth
    addUser(username: String!, email: String!, password: String!): Auth
    saveBook(authors:[String], description: String, title: String, bookId: String, image: String, link: String): User
    removeBook(bookId: String): User
  }
`;

module.exports = typeDefs;

//This schema defines the structure of your GraphQL API, including the types of data that can be queried and the mutations that can be performed (login, save etc)