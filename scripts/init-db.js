const sequelize = require("../config/database")
const { Book, Review } = require("../models")
const logger = require("../config/logger")

// Sample book data
const sampleBooks = [
  {
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    year: 1960,
    genre: "Fiction",
    description: "A gripping tale of racial injustice and childhood innocence in the American South.",
  },
  {
    title: "1984",
    author: "George Orwell",
    year: 1949,
    genre: "Dystopian",
    description: "A chilling novel about totalitarianism and surveillance in a dystopian future.",
  },
  {
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    year: 1925,
    genre: "Fiction",
    description: "A classic American novel about wealth, love, and the American Dream.",
  },
  {
    title: "Pride and Prejudice",
    author: "Jane Austen",
    year: 1813,
    genre: "Romance",
    description: "A witty romance novel exploring social class and personal growth.",
  },
  {
    title: "The Catcher in the Rye",
    author: "J.D. Salinger",
    year: 1951,
    genre: "Fiction",
    description: "A coming-of-age story following a teenage boy in New York City.",
  },
]

// Sample reviews data
const sampleReviews = [
  { bookId: 1, rating: 5, comment: "A masterpiece of American literature. Highly recommended!" },
  { bookId: 1, rating: 4, comment: "Powerful story with important themes." },
  { bookId: 2, rating: 5, comment: "Dystopian brilliance. Still relevant today." },
  { bookId: 3, rating: 5, comment: "Beautiful prose and compelling characters." },
  { bookId: 4, rating: 5, comment: "Timeless romance with witty dialogue." },
]

async function initializeDatabase() {
  try {
    logger.info("Starting database initialization...")

    // Sync database (create tables if they don't exist)
    await sequelize.sync({ alter: true })
    logger.info("Database tables synchronized")

    // Check if books already exist
    const bookCount = await Book.count()
    if (bookCount === 0) {
      // Seed sample books
      const createdBooks = await Book.bulkCreate(sampleBooks)
      logger.info(`Created ${createdBooks.length} sample books`)

      // Seed sample reviews
      await Review.bulkCreate(sampleReviews)
      logger.info(`Created ${sampleReviews.length} sample reviews`)
    } else {
      logger.info("Database already contains books, skipping seed")
    }

    logger.info("Database initialization completed successfully")
    process.exit(0)
  } catch (error) {
    logger.error("Database initialization failed:", error)
    process.exit(1)
  }
}

initializeDatabase()
