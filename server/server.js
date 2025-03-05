const app = require('./src/app');
const connectDB = require('./src/config/dbConnect');
require('dotenv').config();


const PORT = process.env.PORT || 5000;

// Connect to the database and then start the server
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
});
