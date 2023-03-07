/* Amplify Params - DO NOT EDIT
    ENV
    REGION
    API_HEALTHBACKEND_ORDERTABLE_NAME
    API_HEALTHBACKEND_ORDERTABLE_ARN
    API_HEALTHBACKEND_GRAPHQLAPIIDOUTPUT
    API_HEALTHBACKEND_PAYMENTTABLE_NAME
    API_HEALTHBACKEND_PAYMENTTABLE_ARN
    RZP_KEY
    RZP_SECRET
Amplify Params - DO NOT EDIT */

const Razorpay = require("razorpay");
const AWS = require("aws-sdk");

const db = new AWS.DynamoDB.DocumentClient();
const ORDER_TABLE = process.env.API_HEALTHBACKEND_ORDERTABLE_NAME;
const PAYMENT_TABLE = process.env.API_HEALTHBACKEND_PAYMENTTABLE_NAME;

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
exports.handler = async (event) => {
    console.log(`EVENT: ${JSON.stringify(event)}`);
    try {
        const { orderId, razorpayPaymentId } = event.arguments;

        const rp = new Razorpay({
            key_id: process.env.RZP_KEY,
            key_secret: process.env.RZP_SECRET,
        });

        const { Item: order } = await db.get({ TableName: ORDER_TABLE, Key: { id: orderId } }).promise();
        console.log(`🔥 ~ order`, JSON.stringify(order));

        if (order.status === "PENDING" && order.paymentType === "PREPAID" && order.razorpay && order.razorpay.id) {
            const [rzpOrder, rzpPayment] = await Promise.all([
                rp.orders.fetch(order.razorpay.id),
                rp.payments.fetch(razorpayPaymentId),
            ]);

            console.log(`🔥 ~ rzpOrder`, JSON.stringify(rzpOrder));
            console.log(`🔥 ~ rzpPayment`, JSON.stringify(rzpPayment));

            if (rzpOrder && rzpOrder.status === "paid" && rzpPayment) {
                const { notes: { paymentId }, created_at: paymentDate } = rzpPayment;
                if (paymentId) {
                    await db.update({
                        TableName: PAYMENT_TABLE,
                        Key: { id: paymentId },
                        UpdateExpression: "SET #razorpay = :razorpay, #status = :status, #paymentDate = :paymentDate",
                        ExpressionAttributeNames: { "#razorpay": "razorpay", "#status": "status", "#paymentDate": "paymentDate" },
                        ExpressionAttributeValues: {
                            ":razorpay": { orderId: rzpOrder.id, paymentId: rzpPayment.id, payment: rzpPayment },
                            ":status": "PAID",
                            ":paymentDate": new Date(paymentDate * 1000).toISOString(),
                        }

                    }).promise();

                    await db.update({
                        TableName: ORDER_TABLE,
                        Key: { id: orderId },
                        UpdateExpression: "SET #status = :status",
                        ExpressionAttributeNames: { "#status": "status" },
                        ExpressionAttributeValues: { ":status": "CONFIRMED" }
                    }).promise();

                    return { success: true };
                }
            }
        }

    } catch (error) {
        console.log(`🚀 ~ validateTransaction`, error);
    }

    return { success: false };
};
