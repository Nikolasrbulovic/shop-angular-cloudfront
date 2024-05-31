const AWS = require("aws-sdk");

const dynamodb = new AWS.DynamoDB.DocumentClient();
const sns = new AWS.SNS();

module.exports.handler = async (event) => {
  try {
    const tasks = event.Records.map(async (record) => {
      console.log(record.body);
      const productData = JSON.parse(record.body);
      await createProduct(productData);
      await publishToSNS(productData);
    });

    await Promise.all(tasks);
  } catch (error) {
    console.error("Error processing SQS messages:", error);
    throw error;
  }
};

async function createProduct(productData) {
  await dynamodb
    .put({
      TableName: "products",
      Item: {
        product_id: productData.product_id,
        title: productData.title,
        price: productData.price,
        count: productData.count,
        description: productData.description,
      },
    })
    .promise();
}
async function publishToSNS(productData) {
  const params = {
    Message: JSON.stringify(productData),
    TopicArn: "arn:aws:sns:us-east-1:471112551028:createProductTopic",
  };

  try {
    await sns.publish(params).promise();
    console.log("Message published to SNS topic.");
  } catch (error) {
    console.error("Error publishing message to SNS:", error);
    throw error;
  }
}
