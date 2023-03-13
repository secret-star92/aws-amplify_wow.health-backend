/* Amplify Params - DO NOT EDIT
    API_HEALTHBACKEND_GRAPHQLAPIIDOUTPUT
    API_HEALTHBACKEND_SHOPPINGCARTTABLE_ARN
    API_HEALTHBACKEND_SHOPPINGCARTTABLE_NAME
    ENV
    REGION
Amplify Params - DO NOT EDIT */

const AWS = require("aws-sdk");

const db = new AWS.DynamoDB.DocumentClient();
const CART_TABLE = process.env.API_HEALTHBACKEND_SHOPPINGCARTTABLE_NAME;

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
exports.handler = async (event) => {
    console.log(`EVENT: ${JSON.stringify(event)}`);
    const { storeId } = event.arguments;
    const { sub: userId } = event.identity;
    const { Items: [cart] } = await db.query({
        TableName: CART_TABLE, IndexName: "byuserIdSoreIdShoppingCart",
        KeyConditionExpression: '#userId = :userId and #storeId = :storeId',
        ExpressionAttributeNames: {
            "#userId": "userId",
            "#storeId": "storeId"
        },
        ExpressionAttributeValues: {
            ":userId": userId,
            ":storeId": storeId
        }
    }).promise();

    if (cart) {
        return cart;
    }

    const payload = {
        id: `${userId}-${storeId}`,
        userId,
        storeId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        __typename: "ShoppingCart"
    };

    await db.put({ TableName: CART_TABLE, Item: payload }).promise();
    return payload;
};
