require('dotenv').config();
const express = require('express');
const cors = require('cors');
const routes = require('./src/routes');
const { sequelize } = require('./src/models');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use('/api', routes);

// 404 handler - tambahkan sebelum error handling
app.use((req, res) => {
  res.status(404).json({
    status: 'error',
    message: 'Route tidak ditemukan'
  });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Database connection & server start
sequelize.authenticate()
  .then(() => {
    console.log('Database connection established successfully.');
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });
