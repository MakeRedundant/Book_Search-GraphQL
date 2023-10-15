import { gql } from "@apollo/client";

// Mutation to log in a user and return a token and user data
export const LOGIN_USER = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        _id
        username
      }
    }
  }
`;

// Mutation to add a new user and return a token and user data
export const ADD_USER = gql`
  mutation addUser($username: String!, $email: String!, $password: String!) {
    addUser(username: $username, email: $email, password: $password) {
      token
      user {
        _id
        username
      }
    }
  }
`;

// Mutation to save a new book to the user's profile and return updated user data
export const SAVE_BOOK = gql`
  mutation saveBook(
    $authors: [String]!
    $description: String
    $title: String
    $bookId: String
    $image: String
    $link: String
  ) {
    saveBook(
      authors: $authors
      description: $description
      title: $title
      bookId: $bookId
      image: $image
      link: $link
    ) {
      _id
      username
      email
      password
      savedBooks {
        bookId
        authors
        description
        title
        image
        link
      }
      bookCount
    }
  }
`;

// Mutation to remove a book from the user's profile and return updated user data
export const REMOVE_BOOK = gql`
  mutation removeBook($bookId: String) {
    removeBook(bookId: $bookId) {
      _id
      username
      email
      password
      savedBooks {
        bookId
        authors
        description
        title
        image
        link
      }
      bookCount
    }
  }
`;


//These mutations provide essential functionality for user authentication, registration, managing saved books, and book removal in the GraphQL API. 