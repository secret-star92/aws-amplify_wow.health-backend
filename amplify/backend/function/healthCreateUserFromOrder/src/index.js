/* Amplify Params - DO NOT EDIT
	API_HEALTHBACKEND_GRAPHQLAPIENDPOINTOUTPUT
	API_HEALTHBACKEND_GRAPHQLAPIIDOUTPUT
	API_HEALTHBACKEND_GRAPHQLAPIKEYOUTPUT
	API_HEALTHBACKEND_ORDERTABLE_ARN
	API_HEALTHBACKEND_ORDERTABLE_NAME
	API_HEALTHBACKEND_USERADDRESSTABLE_ARN
	API_HEALTHBACKEND_USERADDRESSTABLE_NAME
	API_HEALTHBACKEND_USERTABLE_ARN
	API_HEALTHBACKEND_USERTABLE_NAME
	AUTH_HEALTHBACKEND316F331A316F331A_USERPOOLID
	ENV
	REGION
Amplify Params - DO NOT EDIT */

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
exports.handler = event => {
  console.log(`EVENT: ${JSON.stringify(event)}`);
  event.Records.forEach(record => {
    console.log(record.eventID);
    console.log(record.eventName);
    console.log('DynamoDB Record: %j', record.dynamodb);
  });
  return Promise.resolve('Successfully processed DynamoDB record');
};
