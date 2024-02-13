const errorHandler = (err, req, res, next) => {

    console.error(err);

    if (!res.headersSent) {

        res.status(500).json({ message: 'Internal Server Error'});

    };

};

module.exports = errorHandler;