const AWS = require("aws-sdk");

const ORDER_TABLE = process.env.API_HEALTHBACKEND_ORDERTABLE_NAME;
const USER_POOL_ID = process.env.AUTH_HEALTHBACKEND316F331A316F331A_USERPOOLID;

const db = new AWS.DynamoDB.DocumentClient({});
var cognito = new AWS.CognitoIdentityServiceProvider();

const { unmarshall } = AWS.DynamoDB.Converter;

const getUserName = async ({ shippingAddress }) => {
  try {
    const { name, phone, email } = shippingAddress;
    if (phone) {
      let user = await cognito.adminGetUser({
        UserPoolId: USER_POOL_ID,
        Username: phone,
      })
        .promise()
        .catch(() => null);

      if (!user) {
        const [firstName, lastName] = name?.split(" ");
        const params = {
          UserPoolId: USER_POOL_ID,
          Username: phone,
          DesiredDeliveryMediums: ["EMAIL", "SMS"],
          UserAttributes: [
            {
              Name: "email",
              Value: email,
            },
            {
              Name: "phone_number",
              Value: phone,
            },
            {
              Name: "name",
              Value: firstName || "",
            },
            {
              Name: "middle_name",
              Value: "",
            },
            {
              Name: "given_name",
              Value: lastName || "",
            },
            {
              Name: "email_verified",
              Value: "false",
            },
            {
              Name: "phone_number_verified",
              Value: "false",
            },
          ],
        };
        user = await cognito.adminCreateUser(params).promise();
      }

      return user?.Username;
    }
  } catch (error) {
    console.log(`🚀 ~ getUserName`, error)
  }
  return null;
};

const mapOrderToUser = async ({ dynamodb }) => {
  try {
    const { id, userId, shippingAddress } = unmarshall(dynamodb.NewImage);
    if (!userId && shippingAddress) {
      const username = await getUserName({ shippingAddress });
      if (username) {
        await db.update({
          TableName: ORDER_TABLE,
          Key: { id },
          UpdateExpression: "SET #userId = :userId",
          ExpressionAttributeNames: { "#userId": "userId" },
          ExpressionAttributeValues: { ":userId": username }
        }).promise();
      }
    }
  } catch (err) {
    console.log(`🚀 ~ mapOrderToUser`, err);
  }
  return Promise.resolve();
};

module.exports = { mapOrderToUser };