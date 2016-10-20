var config =
{
    dynamodb : {
        region: process.env.AWS_REGION || "us-west-2",
        endpoint: process.env.AWS_DYNAMODB_ENDPOINT || "http://db:8000",
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || "local",
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "whatever"
    }
};

module.exports = config;
