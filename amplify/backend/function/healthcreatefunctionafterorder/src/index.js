/* Amplify Params - DO NOT EDIT
	API_HEALTHBACKEND_GRAPHQLAPIENDPOINTOUTPUT
	API_HEALTHBACKEND_GRAPHQLAPIIDOUTPUT
	API_HEALTHBACKEND_GRAPHQLAPIKEYOUTPUT
	API_HEALTHBACKEND_ORDERPRODUCTTABLE_ARN
	API_HEALTHBACKEND_ORDERPRODUCTTABLE_NAME
	API_HEALTHBACKEND_ORDERTABLE_ARN
	API_HEALTHBACKEND_ORDERTABLE_NAME
	API_HEALTHBACKEND_PAYMENTTABLE_ARN
	API_HEALTHBACKEND_PAYMENTTABLE_NAME
	API_HEALTHBACKEND_PRODUCTTABLE_ARN
	API_HEALTHBACKEND_PRODUCTTABLE_NAME
	API_HEALTHBACKEND_USERADDRESSTABLE_ARN
	API_HEALTHBACKEND_USERADDRESSTABLE_NAME
	API_HEALTHBACKEND_USERTABLE_ARN
	API_HEALTHBACKEND_USERTABLE_NAME
	AUTH_HEALTHBACKEND316F331A316F331A_USERPOOLID
	ENV
	REGION
Amplify Params - DO NOT EDIT */

const { addOrderCode } = require('./addOrderCode');
const { mapOrderToUser } = require('./mapOrderToUser');
const { updateProductOrders } = require('./updateProductOrders');


/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
exports.handler = async event => {
	console.log(`EVENT: ${JSON.stringify(event)}`);
	await Promise.all(event.Records.map((record) => Promise.all([
		addOrderCode(record),
		mapOrderToUser(record),
		updateProductOrders(record),
	])));
	return Promise.resolve('Successfully processed DynamoDB record');
};
