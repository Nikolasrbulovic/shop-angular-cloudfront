const AWS = require("aws-sdk");
const S3 = new AWS.S3();
const csv = require("csv-parser");
const SQS = new AWS.SQS();

module.exports.handler = async (event) => {
  console.log("Event:", JSON.stringify(event, null, 2));
  const bucket = "my-import-bucket1";
  const key = "products.csv";
  const queueUrl =
    "https://sqs.us-east-1.amazonaws.com/471112551028/catalogItemsQueue";
  try {
    const params = {
      Bucket: bucket,
      Key: `uploaded/${key}`,
    };

    const s3Stream = S3.getObject(params).createReadStream();

    await new Promise((resolve, reject) => {
      const records = [];
      s3Stream
        .pipe(csv())
        .on("data", async (data) => {
          console.log(`Record: ${JSON.stringify(data)}`);
          records.push(data);
        })
        .on("end", async () => {
          console.log("CSV file successfully processed");
          for (const record of records) {
            await SQS.sendMessage({
              QueueUrl: queueUrl,
              MessageBody: JSON.stringify(record),
            }).promise();
          }
          resolve();
        })
        .on("error", (error) => {
          console.error(`Error processing CSV file: ${error}`);
          reject(error);
        });
    });
  } catch (error) {
    console.error(
      `Error getting object ${key} from bucket ${bucket}. Make sure they exist and your bucket is in the same region as this function.`,
    );
    console.error(error);
  }
};
