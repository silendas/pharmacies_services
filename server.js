const express = require('express');
const app = express();
const routes = require('./routes'); // Import routes

app.use(express.json());
app.use('/api', routes); // Semua route akan dimulai dengan prefix `/api`

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
