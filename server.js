require('dotenv').config();
const express = require('express');
const cors = require('cors');
const routes = require('./src/routes');
const { sequelize } = require('./src/models');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3000;

const corsOptions = {
  origin: ['*', 'http://localhost:3000', 'http://localhost:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

// Middleware
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Welcome route
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Welcome to Our API</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 40px;
            text-align: center;
          }
          h1 {
            color: #333;
          }
          p {
            color: #666;
          }
        </style>
      </head>
      <body>
        <h1>Welcome to Our API</h1>
        <p>The API is running successfully.</p>
        <p>Please use /api endpoint to access the API routes.</p>
      </body>
    </html>
  `);
});

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