/* Amplify Params - DO NOT EDIT
	API_HEALTHBACKEND_GRAPHQLAPIIDOUTPUT
	API_HEALTHBACKEND_USERTABLE_ARN
	API_HEALTHBACKEND_USERTABLE_NAME
	ENV
	REGION
Amplify Params - DO NOT EDIT */
const AWS = require('aws-sdk')
const docClient = new AWS.DynamoDB.DocumentClient()


exports.handler = async (event, context, callback) => {
  console.log(`EVENT: ${JSON.stringify(event)}`)
  console.log(`Env: ${process.env.ENV}`)
  if (event.triggerSource !== 'PostConfirmation_ConfirmSignUp') {
    context.done(null, event)
  } else {
    let date = new Date()
    let tableName = process.env.API_HEALTHBACKEND_USERTABLE_NAME
    const params = {
      TableName: tableName,
      /* Item properties will depend on your application concerns */
      Item: {
        id: event.request.userAttributes.sub,
        owner:event.request.userAttributes.sub,
        firstName: event.request.userAttributes.given_name,
        lastName: event.request.userAttributes.name,
        middleName: event.request.userAttributes.family_name,
        email: event.request.userAttributes.email,
        phone: event.request.userAttributes.phone,
        isActive: true,
        isAdmin: false,
        __typename: 'User',
        createdAt: date.toISOString(),
        updatedAt: date.toISOString(),
      },
    }

    async function createItem() {
      try {
        const item = await docClient.put(params).promise()
        console.log('item', item)
      } catch (err) {
        console.log(err)
        console.log('User creation failed, delete the item')
        // deleteItem()
      }
    }

    try {
      await createItem()
      console.log('Done created item!')
      context.done(null, event)
    } catch (err) {
      console.log(err)
      context.done(null, event)
    }
  }
}
