const db = require("../db");

class Book {
  static async createBook(
    title,
    author,
    price,
    description,
    createdAt,
    updatedAt
  ) {
    return new Promise((resolve, reject) => {
      db.query(
        "INSERT INTO books (title, author, price,description,createdAt,updatedAt) VALUES (?, ?, ?, ?, ?, ?)",
        [title, author, price, description, createdAt, updatedAt],
        (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        }
      );
    });
  }
  static async updateBookStatus(bookId, status) {
    return new Promise((resolve, reject) => {
      db.query(
        "UPDATE books SET status=? WHERE id=?",
        [status, bookId],
        (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        }
      );
    });
  }
  static async findBookById(id) {
    return new Promise((resolve, reject) => {
      db.query("SELECT * FROM books WHERE id=?", [id], (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result[0] || null);
        }
      });
    });
  }
}
module.exports = Book;
