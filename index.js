require('dotenv').config(); // Load environment variables from .env
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const MenuItem = require('./MenuItem'); // Import MenuItem schema

const app = express();
app.use(bodyParser.json());

// Connect to MongoDB Atlas using the connection string from .env
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB Atlas');
}).catch(err => {
  console.error('Error connecting to MongoDB Atlas:', err);
});

// POST /menu - Create a new menu item
app.post('/menu', async (req, res) => {
  try {
    const { name, description, price } = req.body;

    if (!name || !price) {
      return res.status(400).json({ error: 'Name and price are required.' });
    }

    const newItem = new MenuItem({ name, description, price });
    const savedItem = await newItem.save();
    res.status(201).json({ message: 'Menu item created successfully.', item: savedItem });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while creating the menu item.' });
  }
});

// GET /menu - Fetch all menu items
app.get('/menu', async (req, res) => {
  try {
    const menuItems = await MenuItem.find();
    res.status(200).json(menuItems);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching the menu items.' });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});