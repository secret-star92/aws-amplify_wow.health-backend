/* Amplify Params - DO NOT EDIT
    API_HEALTHBACKEND_GRAPHQLAPIENDPOINTOUTPUT
    API_HEALTHBACKEND_GRAPHQLAPIIDOUTPUT
    API_HEALTHBACKEND_GRAPHQLAPIKEYOUTPUT
    API_HEALTHBACKEND_ORDERTABLE_ARN
    API_HEALTHBACKEND_ORDERTABLE_NAME
    API_HEALTHBACKEND_PAYMENTTABLE_ARN
    API_HEALTHBACKEND_PAYMENTTABLE_NAME
    AUTH_HEALTHBACKEND316F331A316F331A_USERPOOLID
    ENV
    REGION
Amplify Params - DO NOT EDIT *//* Amplify Params - DO NOT EDIT
    ENV
    REGION
    AUTH_HEALTHBACKEND316F331A316F331A_USERPOOLID
    API_HEALTHBACKEND_GRAPHQLAPIIDOUTPUT
    API_HEALTHBACKEND_GRAPHQLAPIENDPOINTOUTPUT
    API_HEALTHBACKEND_GRAPHQLAPIKEYOUTPUT
    RZP_KEY
    RZP_SECRET
Amplify Params - DO NOT EDIT */

const Razorpay = require("razorpay");
const AWS = require("aws-sdk");

const db = new AWS.DynamoDB.DocumentClient();
const ORDER_TABLE = process.env.API_HEALTHBACKEND_ORDERTABLE_NAME;

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
exports.handler = async (event) => {
    console.log(`EVENT: ${JSON.stringify(event)}`);
    try {
        const { orderId } = event.arguments;
        const rp = new Razorpay({
            key_id: process.env.RZP_KEY,
            key_secret: process.env.RZP_SECRET,
        });

        const { Item: order } = await db.get({ TableName: ORDER_TABLE, Key: { id: orderId } }).promise();
        const { totalAmount } = order;
        console.log(`🔥 ~ order`, order);

        const rzpOrder = await rp.orders
            .create({
                amount: Math.round(totalAmount * 100),
                currency: "INR",
                receipt: orderId,
                payment_capture: true,
                notes: { orderId },
            });

        console.log(`🔥 ~ rzpOrder`, rzpOrder);

        await db.update({
            TableName: ORDER_TABLE,
            Key: { id: orderId },
            UpdateExpression: "SET #razorpay = :razorpay",
            ExpressionAttributeNames: { "#razorpay": "razorpay" },
            ExpressionAttributeValues: { ":razorpay": { id: rzpOrder.id, order: rzpOrder } }

        })
            .promise();

        return {
            orderId: rzpOrder.id,
            amount: Math.round(totalAmount * 100),
        };
    } catch (error) {
        console.log(`🚀 ~ createTransaction`, error);
    }
};
