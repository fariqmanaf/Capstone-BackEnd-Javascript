if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const express = require('express');
const router = require('./routes/index');
const errorHandler = require('./utils/errorHandler');
const morgan = require('morgan');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(morgan('dev'));
app.use(express.json()); // Untuk JSON parsing
app.use(express.urlencoded({ extended: true })); // Untuk form-urlencoded

// Routes
app.use(router);

// Error Handler
app.use(errorHandler);

// Start Server
const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = server;
