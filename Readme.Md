# Tiny Library
A simple Node.js library management system for browsing books and submitting reviews with ratings.

## Features
- Browse a collection of books
- View detailed book information
- Submit reviews with ratings (1–5 stars)
- RESTful API endpoints
- Input validation using Express Validator
- Logging with Winston (to file)

## Installation
1. Install dependencies:  
   `npm install`
2. Start the server:  
   `npm start`
3. (Optional) Run in development mode with auto-reload:  
   `npm run dev`
4. Open your browser and visit: `http://localhost:3000`

## API Endpoints
- GET `/api/books` – Get all books
- GET `/api/books/:id` – Get a specific book
- POST `/api/books` – Create a new book
- DELETE `/api/books/:id` – Delete a book

## Project Structure
- `tiny-library/`
  - `app.js` – Main application file
  - `config/logger.js` – Winston logger configuration
  - `data/books.js` – In-memory data store
  - `routes/books.js` – Route handlers
  - `views/books.ejs` – Books list page
  - `views/book-detail.ejs` – Book detail page
  - `public/styles.css` – Stylesheet
  - `logs/app.log` – Application logs
  - `package.json`

## Technologies Used
- Express.js – Web framework
- EJS – Templating engine
- Winston – Logging
- Express Validator – Input validation
