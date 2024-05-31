"use strict";

const AWS = require("aws-sdk");
const uuid = require("uuid");

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.handler = async (event) => {
  const requestBody = JSON.parse(event.body);
  const { title, price, description, count } = requestBody;

  if (
    typeof title !== "string" ||
    typeof price !== "number" ||
    typeof description !== "string" ||
    typeof count !== "number"
  ) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: "Invalid input",
      }),
    };
  }
  const productId = uuid.v4();
  const newProduct = {
    product_id: productId,
    title,
    price,
    description,
  };

  const params = {
    TableName: "products",
    Item: newProduct,
  };
  const paramsStock = {
    TableName: "stock",
    item: { product_id: productId, count: count },
  };

  try {
    await dynamoDb.put(params).promise();
    await dynamoDb.put(paramsStock).promise();
    return {
      statusCode: 201,
      body: JSON.stringify(newProduct),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Could not create the product",
        error: error.message,
      }),
    };
  }
};
