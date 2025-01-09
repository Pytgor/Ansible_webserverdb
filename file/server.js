const express = require('express');
const path = require('path');
const { Sequelize, DataTypes } = require('sequelize');

const app = express();
const port = 3000;

// Set up Sequelize to connect to PostgreSQL
const sequelize = new Sequelize({
  dialect: 'postgres',
  host: '10.0.0.253',
  username: 'httpd_user',
  password: 'mathmech',
  database: 'httpd_db',
  port: 5432,
});

// Define the record_user model with name and email (assuming those fields exist in the table)
const RecordUser = sequelize.define('RecordUser', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true // Ensure emails are unique
  }
}, {
  // Map the model to the existing 'record_user' table
  tableName: 'record_user',
  timestamps: false // Assuming your table doesn't use timestamps (createdAt, updatedAt)
});

// Synchronize the model with the database (creates the table if it doesn't exist)
sequelize.sync().then(() => console.log('Database connected and table synced!'));

// Middleware to parse JSON bodies
app.use(express.json());

// Serve static files from the "public" directory (for HTML, CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));

// Route for the root path
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Route to fetch all users from the database
app.get('/users', async (req, res) => {
  try {
    const users = await RecordUser.findAll();
    res.json(users);
  } catch (error) {
    res.status(500).send('Error fetching users');
  }
});

// Route to add a new user
app.post('/users', async (req, res) => {
  try {
    const { name, email } = req.body;
    const newUser = await RecordUser.create({ name, email });
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).send('Error creating user');
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
