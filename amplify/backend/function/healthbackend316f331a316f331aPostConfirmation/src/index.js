/* Amplify Params - DO NOT EDIT
  API_HEALTHBACKEND_GRAPHQLAPIIDOUTPUT
  API_HEALTHBACKEND_USERTABLE_ARN
  API_HEALTHBACKEND_USERTABLE_NAME
  ENV
  REGION
Amplify Params - DO NOT EDIT */
const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event, context) => {
  console.log(`EVENT: ${JSON.stringify(event)}`)
  if (event.triggerSource === 'PostConfirmation_ConfirmSignUp') {
    const date = new Date().toISOString();
    const params = {
      TableName: process.env.API_HEALTHBACKEND_USERTABLE_NAME,
      Item: {
        id: event.request.userAttributes.sub,
        owner: event.request.userAttributes.sub,
        firstName: event.request.userAttributes.name,
        lastName: event.request.userAttributes.given_name,
        middleName: event.request.userAttributes.family_name,
        email: event.request.userAttributes.email,
        phone: event.request.userAttributes.phone_number,
        isActive: true,
        isAdmin: false,
        __typename: 'User',
        createdAt: date,
        updatedAt: date,
      },
    };

    try {
      await docClient.put(params).promise();
    } catch (err) {
      console.log(err);
    }
  }

  context.done(null, event);
}
