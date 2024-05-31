const AWS = require("aws-sdk");
const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.handler = async (event) => {
  const product_id = event?.pathParameters?.product_id;

  const params = {
    TableName: "products", // Replace with your DynamoDB table name
    Key: {
      product_id: product_id,
    },
  };

  try {
    const result = await dynamoDb.get(params).promise();

    if (result.Item) {
      return {
        statusCode: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify(result.Item),
      };
    } else {
      return {
        statusCode: 404,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({ message: "Product not found" }),
      };
    }
  } catch (error) {
    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        message: "An error occurred",
        error: error.message,
      }),
    };
  }
};
