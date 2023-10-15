import { gql } from "@apollo/client";

//Query to get users id, pw , email etc
export const GET_ME = gql`
  query me {
    me {
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
