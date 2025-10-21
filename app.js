const express = require("express")
const path = require("path")
const logger = require("./config/logger")
const sequelize = require("./config/database")
const { Book, Review } = require("./models")

const app = express()
const PORT = process.env.PORT || 3000

app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"))

app.use(express.static(path.join(__dirname, "public")))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`)
  next()
})

const booksRouter = require("./routes/books")
app.use("/", booksRouter)

app.get("/", (req, res) => {
  res.redirect("/books")
})

app.use((err, req, res, next) => {
  logger.error("Unhandled error:", err)
  res.status(500).send("Internal Server Error")
})

app.use((req, res) => {
  logger.warn(`404 Not Found: ${req.method} ${req.path}`)
  res.status(404).send("Page not found")
})

async function startServer() {
  try {
    await sequelize.sync({ alter: true })
    logger.info("Database synchronized successfully")

    app.listen(PORT, () => {
      logger.info(`Server running on http://localhost:${PORT}`)
    })
  } catch (error) {
    logger.error("Failed to start server:", error)
    process.exit(1)
  }
}

startServer()
