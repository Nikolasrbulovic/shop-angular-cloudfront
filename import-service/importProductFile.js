"use strict";

const AWS = require("aws-sdk");
const s3 = new AWS.S3();

const BUCKET = "my-import-bucket1";

module.exports.handler = async (event) => {
  console.log(JSON.stringify(event), "xx");
  const name = event.queryStringParameters?.name;
  console.log(name);
  if (!name) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: "Missing required query parameter: name",
      }),
    };
  }

  const params = {
    Bucket: BUCKET,
    Key: `uploaded/${name}`,
    ContentType: "text/csv",
  };
  console.log("conosole 2");
  try {
    const signedUrl = s3.getSignedUrl("putObject", params);
    console.log("conosole 3", signedUrl);
    return {
      statusCode: 200,
      body: JSON.stringify({ url: signedUrl }),
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Could not create signed URL",
        error: error.message,
      }),
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
    };
  }
};
