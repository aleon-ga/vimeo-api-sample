require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { errorHandler } = require('./src/helpers');

// App init
const app = express();

// Middlewares
app.use([
    cors(),
    express.json(),
    express.urlencoded({ extended: true })
]);

// Routes
app.use('/api/v1', require('./src/routes/vimeo'));

// Default error handler
app.use(errorHandler);

// Server port
const port = process.env.PORT || 3000;

// Start server
const server = app.listen(port, () => console.log(`App listening on port ${port}`));

module.exports = { app, server };