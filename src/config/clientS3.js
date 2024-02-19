const { S3Client } = require('@aws-sdk/client-s3');
const { AMAZON_ACCESS_KEY, AMAZON_SECRET_ACCESS_KEY, AMAZON_REGION } = process.env;

const client = new S3Client({
    region: AMAZON_REGION,
    credentials: {
        accessKeyId: AMAZON_ACCESS_KEY,
        secretAccessKey: AMAZON_SECRET_ACCESS_KEY
    }
});

module.exports = client;