const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const jwt = require('jsonwebtoken');
const users = []; // Sample user data
const reviews = []; // Sample review data

public_users.use(express.json());

public_users.post('/register', function(req, res) {
  // Retrieve the username and password from the request body
  const { username, password } = req.body;

  // Check if the username already exists
  const existingUser = users.find(user => user.username === username);
  if (existingUser) {
    return res.status(400).json({ message: 'Username already exists' });
  }

  // Validate the input
  if (!username || !password) {
    return res.status(400).json({ message: 'Please provide both username and password' });
  }

  // Create a new user object
  const newUser = {
    id: users.length + 1,
    username,
    password
  };

  // Add the new user to the users array
  users.push(newUser);

  // Return a success message
  return res.status(201).json({ message: 'User registered successfully' });
});


// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  // Fetch the list of books from the database
  let books = [
    {
      id: 1,
      title: 'Book 1',
      author: 'Author 1',
      price: 9.99
    },
    {
      id: 2,
      title: 'Book 2',
      author: 'Author 2',
      price: 14.99
    },
    {
      id: 3,
      title: 'Book 3',
      author: 'Author 3',
      price: 12.99
    }
  ];

  // Return the list of books as JSON
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function(req, res) {
    // Retrieve the ISBN from the request parameters
    const { isbn } = req.params;
  
    // Find the book with the given ISBN
    const book = books.find(b => b.isbn === isbn);
  
    if (book) {
      // Return the book details as JSON
      return res.status(200).json(JSON.stringify(book, null, 2));
    } else {
      // Return a 404 error if the book is not found
      return res.status(404).json({ message: 'Book not found' });
    }
  });
  
// Get book details based on author
public_users.get('/author/:author', function(req, res) {
    // Retrieve the author from the request parameters
    const { author } = req.params;
  
    // Find all the books by the given author
    const authorBooks = books.filter(book => book.author === author);
  
    if (authorBooks.length > 0) {
      // Return the list of books by the author as JSON
      return res.status(200).json(JSON.stringify(authorBooks, null, 2));
    } else {
      // Return a 404 error if no books are found for the author
      return res.status(404).json({ message: 'No books found for the given author' });
    }
  });

// Get all books based on title
public_users.get('/title/:title', function(req, res) {
    // Retrieve the title from the request parameters
    const { title } = req.params;
  
    // Find the book with the given title
    const book = books.find(b => b.title.toLowerCase() === title.toLowerCase());
  
    if (book) {
      // Return the book details as JSON
      return res.status(200).json(JSON.stringify(book, null, 2));
    } else {
      // Return a 404 error if the book is not found
      return res.status(404).json({ message: 'Book not found' });
    }
  });

//  Get book review
public_users.get('/review/:isbn', function(req, res) {
    // Retrieve the ISBN from the request parameters
    const { isbn } = req.params;
  
    // Find the book with the given ISBN
    const book = books.find(b => b.isbn === isbn);
  
    if (book) {
      // Return the book reviews as JSON
      return res.status(200).json(JSON.stringify(book.reviews, null, 2));
    } else {
      // Return a 404 error if the book is not found
      return res.status(404).json({ message: 'Book not found' });
    }
  });


  // Secret key for JWT signing
const secret_key = 'your_secret_key';

public_users.post('/customer/login', function(req, res) {
  // Retrieve the username and password from the request body
  const { username, password } = req.body;

  // Find the user with the given username
  const user = users.find(u => u.username === username);

  // If the user is not found or the password is incorrect, return an error
  if (!user || user.password !== password) {
    return res.status(401).json({ message: 'Invalid username or password' });
  }

  // Create a JWT token
  const token = jwt.sign({ userId: user.id }, secret_key, { expiresIn: '1h' });

  // Return the token in the response
  return res.status(200).json({ token });
});

// Middleware to verify JWT token
public_users.use((req, res, next) => {
    // Get the token from the Authorization header
    const token = req.headers.authorization;
  
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }
  
    // Verify the token
    jwt.verify(token, secret_key, (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: 'Failed to authenticate token' });
      }
  
      // Store the user ID in the request object
      req.userId = decoded.userId;
      next();
    });
  });
  
  public_users.post('/books/:isbn/review', function(req, res) {
    // Get the ISBN from the request parameters
    const { isbn } = req.params;
  
    // Get the review text from the request body
    const { review } = req.body;
  
    // Get the user ID from the request object
    const userId = req.userId;
  
    // Find the existing review for this user and ISBN
    const existingReview = reviews.find(r => r.userId === userId && r.isbn === isbn);
  
    if (existingReview) {
      // Update the existing review
      existingReview.review = review;
      return res.status(200).json({ message: 'Review updated' });
    } else {
      // Create a new review
      const newReview = {
        id: reviews.length + 1,
        userId,
        isbn,
        review
      };
  
      reviews.push(newReview);
      return res.status(201).json({ message: 'Review added' });
    }
  });


  regd_users.delete("/auth/review/:isbn", (req, res) => {
    // Get the ISBN from the request parameters
    const { isbn } = req.params;
  
    // Get the user ID from the request object
    const userId = req.userId;
  
    // Filter the reviews to find the ones with the given ISBN and user ID
    const remainingReviews = reviews.filter(review => !(review.isbn === isbn && review.userId === userId));
  
    // Update the reviews array with the remaining reviews
    reviews.length = 0;
    reviews.push(...remainingReviews);
  
    res.status(200).json({ message: 'Review deleted' });
  });


  const axios = require('axios');

  // Promise Callback approach
  function getBookListPromise() {
    return new Promise((resolve, reject) => {
      axios.get('/api/books')
        .then(response => {
          resolve(response.data);
        })
        .catch(error => {
          reject(error);
        });
    });
  }
  
  // Async-Await approach
  async function getBookListAsync() {
    try {
      const response = await axios.get('/api/books');
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  
// Promise Callback approach
function getBookByIsbnPromise(isbn) {
    return new Promise((resolve, reject) => {
      axios.get(`/api/books/${isbn}`)
        .then(response => {
          resolve(response.data);
        })
        .catch(error => {
          reject(error);
        });
    });
  }
  
  // Async-Await approach
  async function getBookByIsbnAsync(isbn) {
    try {
      const response = await axios.get(`/api/books/${isbn}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  
  // Promise Callback approach
function getBooksByAuthorPromise(author) {
    return new Promise((resolve, reject) => {
      axios.get(`/api/books?author=${author}`)
        .then(response => {
          resolve(response.data);
        })
        .catch(error => {
          reject(error);
        });
    });
  }
  
  // Async-Await approach
  async function getBooksByAuthorAsync(author) {
    try {
      const response = await axios.get(`/api/books?author=${author}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  

  // Promise Callback approach
function getBooksByTitlePromise(title) {
    return new Promise((resolve, reject) => {
      axios.get(`/api/books?title=${title}`)
        .then(response => {
          resolve(response.data);
        })
        .catch(error => {
          reject(error);
        });
    });
  }
  
  // Async-Await approach
  async function getBooksByTitleAsync(title) {
    try {
      const response = await axios.get(`/api/books?title=${title}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  
  module.exports = {
    public_users,
    getBookListPromise,
    getBookListAsync,
    getBookByIsbnPromise,
    getBookByIsbnAsync,
    getBooksByAuthorPromise,
    getBooksByAuthorAsync,
    getBooksByTitlePromise,
    getBooksByTitleAsync
  };

