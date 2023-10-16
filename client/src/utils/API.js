// This code defines a function searchGoogleBooks that makes a fetch request to the Google Books API based on a provided search query. 

export const searchGoogleBooks = (query) => {
  return fetch(`https://www.googleapis.com/books/v1/volumes?q=${query}`);
};
