

const GRAPHQL_ENDPOINT = process.env.API_HEALTHBACKEND_GRAPHQLAPIENDPOINTOUTPUT;
const GRAPHQL_API_KEY = process.env.API_HEALTHBACKEND_GRAPHQLAPIKEYOUTPUT;
const fetch = require('node-fetch');
const Request = fetch.Request;


const {  searchProducts ,listOrders } = require('./graphql.js'); // graphql.js exports the GraphQL query
// const { sendResponse } = require('./generateResponse.js');




const SearchProducts = async (queryParam) => {
    console.log(`🔥 ~ file: app.js:38 ~ SearchProducts ~ publishedStatus`, queryParam)
    // pageNumber=1&pageSize=50&skus=abc&publishedStatus=PUBLISHED
    let statusCode = 200;
    let message = 'Something Wrong';
    let body;
    let response;
    // let filter
    //   filter = {
    //     publishedAt: {
    //       exists: false
    //     }
    //   }
    // searchProducts(filter: {isPublished: {eq: true}, sku: {eq: "sf"}}, limit: 10) {
  
  
      // pageSize=50&pageNumber=1&orderStatus=CREATED&orderDateFrom=2021-09-22T16:13:44+05:30&orderDateTo=2021-12-21T16:13:44+05:30&orderStatus=CREATED
  
    const options = {
        method: 'POST',
        headers: {
            'x-api-key': GRAPHQL_API_KEY,
        },
        body: JSON.stringify({
            query: searchProducts,
          variables: 
          // {
          //   "filter": {
          //     "isPublished":{
          //       "eq": queryParam.publishedStatus
          //     },
          //     "sku":{
          //       "eq": queryParam.skus
          //     },
          //   },
          //   "limit" : queryParam.pageSize,
          //   "nextToken" : queryParam.pageNumber
          // },
          {
            "filter": {
              "publishedAt": {
                "exists": queryParam.publishedStatus === 'PUBLISHED' ? true : false,
              },
              // "isPublished": {"eq": queryParam.publishedStatus},
              
              // "sku": {"eq": queryParam.skus}
              
            },
            // "limit": queryParam.pageSize,
            // "nextToken": queryParam.pageNumber
          }
        }),
    };
    console.log(`🔥 ~ file: app.js:94 ~ //searchProducts ~ options`, options)
  
    const request = new Request(GRAPHQL_ENDPOINT, options);
  
    try {
        response = await fetch(request);
        body = await response.json();
  
        if (body.errors) statusCode = 400;
    } catch (error) {
        statusCode = 400;
        (message = error.message),
            (body = {
                errors: [
                    {
                        status: response.status,
                        // message: error.message,
                        stack: error.stack,
                    },
                ],
            });
    }
    return {
        statusCode,
        body,
        message,
    };
  };