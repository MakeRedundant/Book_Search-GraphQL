// Function to get saved book IDs from localStorage
export const getSavedBookIds = () => {
  // Retrieve saved book IDs from localStorage if available
  const savedBookIds = localStorage.getItem('saved_books')
    ? JSON.parse(localStorage.getItem('saved_books'))
    : [];

  // Returns the array of saved book IDs
  return savedBookIds;
};

// Function to save book IDs to localStorage
export const saveBookIds = (bookIdArr) => {
  // Check if there are book IDs to save
  if (bookIdArr.length) {
    // Save the provided book IDs as a JSON string in localStorage
    localStorage.setItem('saved_books', JSON.stringify(bookIdArr));
  } else {
    localStorage.removeItem('saved_books');
  }
};

// Function to remove a specific book ID from saved books in localStorage
export const removeBookId = (bookId) => {
  // Retrieve saved book IDs from localStorage, or set to null if not available
  const savedBookIds = localStorage.getItem('saved_books')
    ? JSON.parse(localStorage.getItem('saved_books'))
    : null;

  if (!savedBookIds) {
    return false;
  }

  // Filter out the specified book ID from the saved book IDs array
  const updatedSavedBookIds = savedBookIds.filter((savedBookId) => savedBookId !== bookId);

  // Save the updated book IDs to localStorage
  localStorage.setItem('saved_books', JSON.stringify(updatedSavedBookIds));

  return true;
};
