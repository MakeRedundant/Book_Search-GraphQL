import { Container, Card, Button, Row, Col } from "react-bootstrap";
import Auth from "../utils/auth";
import { removeBookId } from "../utils/localStorage";
import { useMutation, useQuery } from "@apollo/client";
import { REMOVE_BOOK } from "../utils/mutations";
import { GET_ME } from "../utils/queries";

const SavedBooks = () => {
  // Fetch user data from the server
  const { loading, data } = useQuery(GET_ME);
  // Extract user data from the query response, or set it to an empty object if data is not available yet
  const userData = data?.me || {};

  // Calculate the number of properties in the userData object
  const userDataLength = Object.keys(userData).length;

  // Define the removeBook mutation and handleDeleteBook function to delete a saved book
  const [removeBook, { error }] = useMutation(REMOVE_BOOK, {
    refetchQueries: [],
  });

  // Function to handle deleting a book
  const handleDeleteBook = async (bookId) => {
    // Check if the user is logged in and get the authentication token
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    try {
      // Call the removeBook mutation to remove the book from the user's saved books
      const { data } = await removeBook({
        variables: {
          bookId,
        },
      });

      // Remove the book's ID from local storage
      removeBookId(bookId);
    } catch (err) {
      console.error(err);
    }
  };

  // If user data is still rendering, display a loading message
  if (loading) {
    return <h2>LOADING...</h2>;
  }

  return (
    <>
      <div fluid="true" className="text-light bg-dark p-5">
        <Container>
          <h1>Viewing saved books!</h1>
        </Container>
      </div>
      <Container>
        <h2 className="pt-5">
          {userData.savedBooks.length
            ? `Viewing ${userData.savedBooks.length} saved ${
                userData.savedBooks.length === 1 ? "book" : "books"
              }:`
            : "You have no saved books!"}
        </h2>
        <Row>
          {userData.savedBooks.map((book) => {
            return (
              <Col key={book.bookId} md="4">
                <Card border="dark">
                  {book.image ? (
                    <Card.Img
                      src={book.image}
                      alt={`The cover for ${book.title}`}
                      variant="top"
                    />
                  ) : null}
                  <Card.Body>
                    <Card.Title>
                      <a href={book.link}>{book.title}</a>
                    </Card.Title>
                    <p className="small">Authors: {book.authors}</p>
                    <Card.Text>{book.description}</Card.Text>
                    <Button
                      className="btn-block btn-danger"
                      onClick={() => handleDeleteBook(book.bookId)}
                    >
                      Delete this Book!
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      </Container>
    </>
  );
};

export default SavedBooks;
