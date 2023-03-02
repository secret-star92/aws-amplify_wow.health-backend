/* Amplify Params - DO NOT EDIT
  API_HEALTHBACKEND_GRAPHQLAPIENDPOINTOUTPUT
  API_HEALTHBACKEND_GRAPHQLAPIIDOUTPUT
  API_HEALTHBACKEND_GRAPHQLAPIKEYOUTPUT
  API_HEALTHBACKEND_PRODUCTTABLE_ARN
  API_HEALTHBACKEND_PRODUCTTABLE_NAME
  ENV
  REGION
Amplify Params - DO NOT EDIT */

const AWS = require("aws-sdk");
const { default: fetch, Request } = require("node-fetch");

const { searchReviews } = require("./graphql");

const GRAPHQL_ENDPOINT = process.env.API_HEALTHBACKEND_GRAPHQLAPIENDPOINTOUTPUT;
const GRAPHQL_API_KEY = process.env.API_HEALTHBACKEND_GRAPHQLAPIKEYOUTPUT;
const PRODUCT_TABLE = process.env.API_HEALTHBACKEND_PRODUCTTABLE_NAME;

const db = new AWS.DynamoDB.DocumentClient({});
const { unmarshall } = AWS.DynamoDB.Converter;

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
exports.handler = async event => {
  console.log(`EVENT: ${JSON.stringify(event)}`);
  await Promise.all(event.Records.map(async ({ eventName, dynamodb }) => {
    if (eventName === "INSERT") {
      const { productId } = unmarshall(dynamodb.NewImage);
      const rating = await aggregateReview(productId);
      if (rating) {
        await db.update({
          TableName: PRODUCT_TABLE,
          Key: { id: productId },
          UpdateExpression: "SET #rating = :rating",
          ExpressionAttributeNames: { "#rating": "rating" },
          ExpressionAttributeValues: { ":rating": rating }
        }).promise();
      }
    }
  }));
  return Promise.resolve('Successfully processed DynamoDB record');
};

const aggregateReview = async (productId) => {
  const options = {
    method: "POST",
    headers: {
      "x-api-key": GRAPHQL_API_KEY,
    },
    body: JSON.stringify({
      query: searchReviews,
      variables: {
        limit: 0,
        filter: { productId: { eq: productId } },
        aggregates: [
          {
            name: "totalReview",
            field: "rating",
            type: "sum"
          }
        ]
      }
    }),
  };

  const request = new Request(GRAPHQL_ENDPOINT, options);

  try {
    const response = await fetch(request);
    const body = await response.json();
    console.log(`🔥 ~ aggregateReview`, JSON.stringify(body));
    const { total, aggregateItems } = body.data.searchReviews;
    const [{ result: { value = 0 } }] = aggregateItems;
    if (total) {
      return Number(parseFloat(value / total).toFixed(2));
    }
  } catch (error) {
    console.log(`🚀 ~ aggregateReview`, error)
  }
  return null;
};