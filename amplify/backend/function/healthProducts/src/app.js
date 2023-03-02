/* Amplify Params - DO NOT EDIT
	API_HEALTHBACKEND_GRAPHQLAPIENDPOINTOUTPUT
	API_HEALTHBACKEND_GRAPHQLAPIIDOUTPUT
	API_HEALTHBACKEND_GRAPHQLAPIKEYOUTPUT
	ENV
	REGION
Amplify Params - DO NOT EDIT *//*
Copyright 2017 - 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at
    http://aws.amazon.com/apache2.0/
or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and limitations under the License.
*/

const GRAPHQL_ENDPOINT = process.env.API_HEALTHBACKEND_GRAPHQLAPIENDPOINTOUTPUT;
const GRAPHQL_API_KEY = process.env.API_HEALTHBACKEND_GRAPHQLAPIKEYOUTPUT;
const fetch = require('node-fetch');
const Request = fetch.Request;
const {  searchProducts } = require('./graphql.js'); // graphql.js exports the GraphQL query

const express = require('express')
const bodyParser = require('body-parser')
const awsServerlessExpressMiddleware = require('aws-serverless-express/middleware');
const { sendResponse } = require('./generateResponse.js');

// declare a new express app
const app = express()
app.use(bodyParser.json())
app.use(awsServerlessExpressMiddleware.eventContext())

// Enable CORS for all methods
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "*")
  next()
});
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


    // "pageNumber" : req.query.pageNumber || 1,
    // "pageSize" : 50, //fixed req.query.pageNumber,
    // "skus" : req.query.skus || '', //Optional,
    // "publishedStatus" : req.query.publishedStatus


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

/**********************
 * Example get method *
 **********************/
//  pageNumber=1&pageSize=50&skus=abc&publishedStatus=PUBLISHED
app.get('/products', async function(req, res) {
  // Add your code here
  // pageNumber=1&pageSize=50&skus=abc&publishedStatus=PUBLISHED

  const queryParam ={
    "pageNumber" : req.query.pageNumber || 1,
    "pageSize" : 50, //fixed req.query.pageNumber,
    "skus" : req.query.skus || '', //Optional,
    "publishedStatus" : req.query.publishedStatus
  } 
    if(true){
    // if(queryParam === 'PUBLISHED' || queryParam === 'UNPUBLISHED'){
      const queryResponse = await SearchProducts(queryParam);
      console.log("🚀 ~ file: app.js:100 ~ app.get ~ queryResponse", JSON.stringify(queryResponse))
      // "body": {
    //     "data": {
    //         "searchProducts": {
    //             "items": [
     let response =[]
    
     queryResponse.body.data.searchProducts.items && queryResponse.body.data.searchProducts.items.length>0 && 
     queryResponse.body.data.searchProducts.items.map((product)=>{
      // console.log("🚀 ~ file: app.js:106 ~ product", product)
    
      response.push( sendResponse(product) )
     }) 
    //  response = [
    //   ...response,
    //   {
    //     nextToken : JSON.stringify(queryResponse.body.data.searchProducts.nextToken),
    //   total:  JSON.stringify(queryResponse.body.data.searchProducts.total),
    //   }
    //  ]

     response = {
      data:
        response
      ,
      nextToken : JSON.stringify(queryResponse.body.data.searchProducts.nextToken),
      total:  JSON.stringify(queryResponse.body.data.searchProducts.total),
     }
      // 
    
     
    
     console.log("🚀 ~ file: app.js:106 ~ response", response)
    
    
        if (queryResponse.statusCode === 200) {
            res.json(
              // body: JSON.stringify(queryResponse.body),
              //   statusCode: queryResponse.statusCode,
              //   total: JSON.stringify(queryResponse.body.data.searchProducts.total),
             response 
            
            );
        } else {
            res.json({
                message: queryResponse.message,
                body: JSON.stringify(queryResponse.body),
            });
        }
    }else{
        res.json({
            message: 'Invalid Parameters!',
            // body: JSON.stringify(queryResponse.body),
        });
    }


  
});

app.get('/products/*', function(req, res) {
  // Add your code here
  res.json({success: 'get call succeed!', url: req.url});
});

/****************************
* Example post method *
****************************/

app.post('/products', function(req, res) {
  // Add your code here
  res.json({success: 'post call succeed!', url: req.url, body: req.body})
});

app.post('/products/*', function(req, res) {
  // Add your code here
  res.json({success: 'post call succeed!', url: req.url, body: req.body})
});

/****************************
* Example put method *
****************************/

app.put('/products', function(req, res) {
  // Add your code here
  res.json({success: 'put call succeed!', url: req.url, body: req.body})
});

app.put('/products/*', function(req, res) {
  // Add your code here
  res.json({success: 'put call succeed!', url: req.url, body: req.body})
});

/****************************
* Example delete method *
****************************/

app.delete('/products', function(req, res) {
  // Add your code here
  res.json({success: 'delete call succeed!', url: req.url});
});

app.delete('/products/*', function(req, res) {
  // Add your code here
  res.json({success: 'delete call succeed!', url: req.url});
});

app.listen(3000, function() {
    console.log("App started")
});

// Export the app object. When executing the application local this does nothing. However,
// to port it to AWS Lambda we will create a wrapper around that will load the app from
// this file
module.exports = app
