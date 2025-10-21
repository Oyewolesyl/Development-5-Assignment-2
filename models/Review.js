const { DataTypes } = require("sequelize")
const sequelize = require("../config/database")
const Book = require("./Book")

const Review = sequelize.define(
  "Review",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: true,
        min: 1,
        max: 5,
      },
    },
    comment: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: { msg: "Comment is required" },
      },
    },
    bookId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Book,
        key: "id",
      },
    },
  },
  {
    timestamps: true,
    tableName: "reviews",
  },
)

// Define association
Book.hasMany(Review, { foreignKey: "bookId", as: "reviews" })
Review.belongsTo(Book, { foreignKey: "bookId" })

module.exports = Review
