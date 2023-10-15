//Import from apollo
import { gql } from "@apollo/client";

//Query to get user, returns user
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
