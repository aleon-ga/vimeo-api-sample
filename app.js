require('dotenv').config();
const express = require('express');
const cors = require('cors');

// App init
const app = express();

// Middlewares
app.use([
    cors(),
    express.json(),
    express.urlencoded({ extended: false })
]);

// Routes
app.get('/health-check', (req, res) => {

    res.status(200).json({ message: 'Alive!' });

});

// Default error handler
app.use((err, req, res, next) => {

    console.error(err);

    if (!res.headersSent) {

        res.status(500).json({ message: 'Internal Server Error'});

    };

});

// Server port
const port = process.env.PORT || 3000;

// Start server
const server = app.listen(port, () => console.log(`App listening on port ${port}`));

module.exports = { app, server };