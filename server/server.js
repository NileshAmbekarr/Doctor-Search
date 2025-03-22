require('dotenv').config(); // Ensure environment variables are loaded
const app = require('./src/app');
const mongoose = require('mongoose');
const port = process.env.PORT || 3000;

// Validate required environment variables
if (!process.env.JWT_SECRET) {
  console.error('Error: JWT_SECRET environment variable is required');
  process.exit(1);
}

if (!process.env.MONGO_URI) {
  console.error('Error: MONGO_URI environment variable is required');
  process.exit(1);
}

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  })
  .catch(err => {
    console.error('Error connecting to MongoDB:', err.message);
    process.exit(1);
  });
