const AWS = require("aws-sdk");
const ORDER_TABLE = process.env.API_HEALTHBACKEND_ORDERTABLE_NAME;

const db = new AWS.DynamoDB.DocumentClient({});
const { unmarshall } = AWS.DynamoDB.Converter;

const searchTotalOrders = async () => {
  try {
    const { Count: totalOrder } = await db.scan({ TableName: ORDER_TABLE, Select: "COUNT" }).promise();
    return totalOrder;
  } catch (error) {
    console.log(`🚀 ~ searchTotalOrders`, error)
  }
  return 0;
};

const addOrderCode = async ({ eventName, dynamodb }) => {
  try {
    if (eventName === "INSERT") {
      const { id } = unmarshall(dynamodb.NewImage);
      const totalOrder = await searchTotalOrders();
      const orderCode = String(totalOrder).padStart(4, "0");
      await db.update({
        TableName: ORDER_TABLE,
        Key: { id },
        UpdateExpression: "SET #code = :code",
        ExpressionAttributeNames: { "#code": "code" },
        ExpressionAttributeValues: { ":code": orderCode }
      }).promise();
    }
  } catch (err) {
    console.log(`🚀 ~ addOrderCode`, err);
  }
  return Promise.resolve();
};

module.exports = { addOrderCode };