/* Amplify Params - DO NOT EDIT
    API_HEALTHBACKEND_COUPONCODETABLE_ARN
    API_HEALTHBACKEND_COUPONCODETABLE_NAME
    API_HEALTHBACKEND_GRAPHQLAPIENDPOINTOUTPUT
    API_HEALTHBACKEND_GRAPHQLAPIIDOUTPUT
    API_HEALTHBACKEND_GRAPHQLAPIKEYOUTPUT
    ENV
    REGION
Amplify Params - DO NOT EDIT */
const AWS = require("aws-sdk");
const docClient = new AWS.DynamoDB.DocumentClient();

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
exports.handler = async (event) => {
    console.log(`EVENT: ${JSON.stringify(event)}`);
    const user = event.identity?.claims?.sub;

    const response = await getCouponsbyCode(event.arguments.code);
    if (response?.Count) {
        const { Items: coupons = [] } = response;
        const [coupon] = coupons;
        if (coupon) {
            const { expirationDate, userId, isActive } = coupon;
            if (isActive) {
                // allow if no expiry set or expiry is later
                if (!expirationDate || new Date(expirationDate).getTime() > new Date().getTime()) {
                    // allow public coupon or if coupon is for same user
                    if (!userId || user === userId) {
                        return coupon;
                    }
                }
            }
        }
    }
    return null;
};


async function getCouponsbyCode(code) {
    try {
        const params = {
            TableName: process.env.API_HEALTHBACKEND_COUPONCODETABLE_NAME,
            IndexName: "bycodeCouponCode",
            KeyConditionExpression: "code = :v1",
            ScanIndexForward: false,
            ExpressionAttributeValues: {
                ":v1": code.toUpperCase()
            },
        };
        return docClient.query(params).promise();
    } catch (err) {
        console.log("getCouponsbyCode failed catch", err.message);
        return err;
    }
}
