const extractRateLimitHeaders = (headers) => {

    // Convierte los encabezados a un objeto JSON
    const headersJSON = {};

    headers.forEach((value, name) => {

        headersJSON[name] = value;

    });

    const rateLimit = headersJSON['x-ratelimit-limit'];

    const rateLimitRemaining = headersJSON['x-ratelimit-remaining'];

    const rateLimitReset = headersJSON['x-ratelimit-reset'].split('T')[1].split('+')[0];

    return { rateLimit, rateLimitRemaining, rateLimitReset };

};

module.exports = extractRateLimitHeaders;