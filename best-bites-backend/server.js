const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());

// SQLite Database Setup
const db = new sqlite3.Database('./best_bites.db');
/*
// Modify the CREATE TABLE statement
db.run(`
  CREATE TABLE IF NOT EXISTS FoodItems (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    restaurant TEXT NOT NULL,
    price REAL NOT NULL,
    taste REAL NOT NULL,
    filling REAL NOT NULL,
    rating REAL NOT NULL
  )
`);
*/
// Example INSERT statement with rating calculation
const exampleFoodItem = {
  name: 'Chicken Parmigiana',
  restaurant: 'Mamamia',
  price: 15,
  Taste: 9,
  filling: 8,
};

// Insert the example food item into the FoodItems table with automatic rating calculation
db.run(`
  INSERT INTO FoodItems (name, restaurant, price, Taste, filling, rating)
  VALUES (?, ?, ?, ?, ?, (Taste * filling) / price)
`, [exampleFoodItem.name, exampleFoodItem.restaurant, exampleFoodItem.price, exampleFoodItem.Taste, exampleFoodItem.filling],
function (err) {
  if (err) {
    console.error(err.message);
  } else {
    console.log(`A new row has been inserted with ID ${this.lastID}`);
  }
});


// Routes
app.get('/api/foodItems', (req, res) => {
  db.all('SELECT * FROM FoodItems', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
