const db = require("../db");

class Order {
  static async createOrder(userId, bookId, quantity, totalPrice) {
    return new Promise((resolve, reject) => {
      db.query(
        "INSERT INTO orders (user_id, book_id, quantity, total_price) VALUES (?, ?, ?, ?)",
        [userId, bookId, quantity, totalPrice],
        (err, result) => {
          if (err) reject(err);
          else resolve(result);
        }
      );
    });
  }
}

module.exports = Order;
