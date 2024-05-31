const AWS = require("aws-sdk");
const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.handler = async (event) => {
  try {
    const productsResult = await dynamoDb
      .scan({ TableName: "products" })
      .promise();
    const stockResult = await dynamoDb.scan({ TableName: "stock" }).promise();

    const products = productsResult.Items;
    const stock = stockResult.Items;

    const productMap = products.reduce((acc, product) => {
      acc[product.product_id] = product;
      return acc;
    }, {});

    stock.forEach((stockItem) => {
      if (productMap[stockItem.product_id]) {
        productMap[stockItem.product_id].count = stockItem.count;
      }
    });

    const productList = Object.values(productMap);

    return {
      statusCode: 200,
      body: JSON.stringify(productList),
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
    };
  } catch (error) {
    console.error("Error fetching products:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to fetch products" }),
    };
  }
};
