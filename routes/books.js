const express = require("express")
const router = express.Router()
const { body, validationResult } = require("express-validator")
const logger = require("../config/logger")
const { Book, Review } = require("../models")

const bookValidation = [
  body("title").trim().notEmpty().withMessage("Title is required"),
  body("author").trim().notEmpty().withMessage("Author is required"),
  body("year").isInt({ min: 1000, max: new Date().getFullYear() }).withMessage("Valid year is required"),
  body("genre").trim().notEmpty().withMessage("Genre is required"),
  body("description").trim().notEmpty().withMessage("Description is required"),
]

const reviewValidation = [
  body("rating").isInt({ min: 1, max: 5 }).withMessage("Rating must be between 1 and 5"),
  body("comment").trim().notEmpty().withMessage("Comment is required"),
]

router.get("/books", async (req, res) => {
  try {
    const books = await Book.findAll({
      include: {
        association: "reviews",
        attributes: ["id", "rating", "comment"],
      },
      order: [["createdAt", "DESC"]],
    })
    res.render("books", { books })
  } catch (error) {
    logger.error("Error fetching books:", error)
    res.status(500).send("Error loading books")
  }
})

router.get("/books/:id", async (req, res) => {
  try {
    const book = await Book.findByPk(req.params.id, {
      include: {
        association: "reviews",
        attributes: ["id", "rating", "comment"],
        order: [["createdAt", "DESC"]],
      },
    })

    if (!book) {
      logger.warn(`Book not found: ${req.params.id}`)
      return res.status(404).send("Book not found")
    }

    res.render("book-detail", { book })
  } catch (error) {
    logger.error("Error fetching book:", error)
    res.status(500).send("Error loading book")
  }
})

router.get("/api/books", async (req, res) => {
  try {
    const books = await Book.findAll({
      include: {
        association: "reviews",
        attributes: ["id", "rating", "comment"],
      },
    })
    logger.info("Retrieved all books")
    res.json(books)
  } catch (error) {
    logger.error("Error fetching books from API:", error)
    res.status(500).json({ error: "Error fetching books" })
  }
})

router.get("/api/books/:id", async (req, res) => {
  try {
    const book = await Book.findByPk(req.params.id, {
      include: {
        association: "reviews",
        attributes: ["id", "rating", "comment"],
      },
    })

    if (!book) {
      logger.warn(`API: Book not found: ${req.params.id}`)
      return res.status(404).json({ error: "Book not found" })
    }

    logger.info(`Retrieved book: ${book.title}`)
    res.json(book)
  } catch (error) {
    logger.error("Error fetching book from API:", error)
    res.status(500).json({ error: "Error fetching book" })
  }
})

router.post("/api/books", bookValidation, async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    logger.warn("Validation failed for new book")
    return res.status(400).json({ errors: errors.array() })
  }

  try {
    const newBook = await Book.create({
      title: req.body.title,
      author: req.body.author,
      year: req.body.year,
      genre: req.body.genre,
      description: req.body.description,
    })

    logger.info(`New book created: ${newBook.title}`)
    res.status(201).json(newBook)
  } catch (error) {
    logger.error("Error creating book:", error)
    res.status(500).json({ error: "Error creating book" })
  }
})

router.delete("/api/books/:id", async (req, res) => {
  try {
    const book = await Book.findByPk(req.params.id)

    if (!book) {
      logger.warn(`Failed to delete book: ${req.params.id}`)
      return res.status(404).json({ error: "Book not found" })
    }

    await book.destroy()
    logger.info(`Book deleted: ${req.params.id}`)
    res.json({ message: "Book deleted successfully" })
  } catch (error) {
    logger.error("Error deleting book:", error)
    res.status(500).json({ error: "Error deleting book" })
  }
})

router.post("/books/:id/review", reviewValidation, async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    logger.warn("Validation failed for review")
    return res.redirect(`/books/${req.params.id}?error=validation`)
  }

  try {
    const book = await Book.findByPk(req.params.id)

    if (!book) {
      logger.warn(`Failed to add review for book: ${req.params.id}`)
      return res.status(404).send("Book not found")
    }

    await Review.create({
      rating: Number.parseInt(req.body.rating),
      comment: req.body.comment,
      bookId: book.id,
    })

    logger.info(`Review added for book: ${req.params.id}`)
    res.redirect(`/books/${req.params.id}`)
  } catch (error) {
    logger.error("Error adding review:", error)
    res.status(500).send("Error adding review")
  }
})

module.exports = router
