const AWS = require("aws-sdk");

const db = new AWS.DynamoDB.DocumentClient({});
const { unmarshall } = AWS.DynamoDB.Converter;

const PRODUCT_TABLE = process.env.API_HEALTHBACKEND_PRODUCTTABLE_NAME;

const updateProductOrders = async ({ eventName, dynamodb }) => {
  try {
    const { NewImage, OldImage = NewImage } = dynamodb;
    const { productId, status } = unmarshall(NewImage);
    const { status: oldStatus } = unmarshall(OldImage);

    const increment = (status === "CONFIRMED") && (eventName === "INSERT" || (eventName === "MODIFY" && oldStatus !== "CONFIRMED"));

    if (productId && increment) {
      await db.update({
        TableName: PRODUCT_TABLE,
        Key: { id: productId },
        UpdateExpression: "ADD #totalOrders :totalOrders",
        ExpressionAttributeNames: { "#totalOrders": "totalOrders" },
        ExpressionAttributeValues: {
          ":totalOrders": 1,
        },
      }).promise();
    }
  } catch (err) {
    console.log(`🚀 ~ updateProductOrders`, err);
  }
  return Promise.resolve();
};

module.exports = { updateProductOrders };