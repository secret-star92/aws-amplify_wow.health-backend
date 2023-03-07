'use strict';

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
exports.handler = async (event, context) => {
  // insert code to be executed by your lambda trigger

  console.log('Received EVENT', JSON.stringify(event, null, 2));
  event.response.autoConfirmUser = false;
  event.response.autoVerifyPhone = false;
  
  return event;
};
