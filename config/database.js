const { Sequelize } = require("sequelize")
const path = require("path")
const logger = require("./logger")

// Initialize Sequelize with SQLite
const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: path.join(__dirname, "../data/library.db"),
  logging: (msg) => logger.debug(msg),
})

// Test the connection
sequelize
  .authenticate()
  .then(() => {
    logger.info("Database connection established successfully")
  })
  .catch((err) => {
    logger.error("Unable to connect to the database:", err)
  })

module.exports = sequelize
