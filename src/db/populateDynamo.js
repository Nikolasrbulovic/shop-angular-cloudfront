const AWS = require("aws-sdk");
const { v4: uuidv4 } = require("uuid");

AWS.config.update({
  region: "us-east-1",
});

const dynamodb = new AWS.DynamoDB.DocumentClient();

const products = [
  {
    product_id: uuidv4(),
    title: "Product 1",
    description: "Description for product 1",
    price: 100,
  },
  {
    product_id: uuidv4(),
    title: "Product 2",
    description: "Description for product 2",
    price: 200,
  },
  {
    product_id: uuidv4(),
    title: "Product 3",
    description: "Description for product 3",
    price: 300,
  },
];

const stocks = products.map((product) => ({
  product_id: product.product_id,
  count: Math.floor(Math.random() * 100) + 1,
}));

const populateTable = async (tableName, items) => {
  const promises = items.map((item) => {
    const params = {
      TableName: tableName,
      Item: item,
    };
    return dynamodb.put(params).promise();
  });
  await Promise.all(promises);
};

const main = async () => {
  try {
    await populateTable("products", products);
    await populateTable("stock", stocks);
    console.log("Data populated successfully.");
  } catch (error) {
    console.error("Error populating data:", error);
  }
};

main();
