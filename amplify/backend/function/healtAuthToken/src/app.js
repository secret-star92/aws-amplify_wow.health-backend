/* Amplify Params - DO NOT EDIT
	API_HEALTHBACKEND_GRAPHQLAPIENDPOINTOUTPUT
	API_HEALTHBACKEND_GRAPHQLAPIIDOUTPUT
	API_HEALTHBACKEND_GRAPHQLAPIKEYOUTPUT
	AUTH_HEALTHBACKEND316F331A316F331A_USERPOOLID
	ENV
	REGION
Amplify Params - DO NOT EDIT */
/*
Copyright 2017 - 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at
    http://aws.amazon.com/apache2.0/
or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and limitations under the License.
*/
const AWS = require("aws-sdk");

const express = require("express");
const bodyParser = require("body-parser");
const awsServerlessExpressMiddleware = require("aws-serverless-express/middleware");
const cognito = new AWS.CognitoIdentityServiceProvider();
// declare a new express app
const app = express();
app.use(bodyParser.json());
app.use(awsServerlessExpressMiddleware.eventContext());

// Enable CORS for all methods
app.use(function (req, res, next) {
   res.header("Access-Control-Allow-Origin", "*");
   res.header("Access-Control-Allow-Headers", "*");
   next();
});

/**********************
 * Example get method *
 **********************/

app.get("/authToken", async function (req, res) {
   try {
      const { username, password } = req.query;
      const params = {
         AuthFlow: "ADMIN_NO_SRP_AUTH",
         UserPoolId: process.env.USER_POOL_ID,
         ClientId: process.env.CLIENT_ID,
         AuthParameters: {
            USERNAME: username,
            PASSWORD: password,
         },
      };
      const response = await cognito.adminInitiateAuth(params).promise();
      const { AccessToken, ExpiresIn, TokenType, RefreshToken, IdToken } =
         response.AuthenticationResult;
      res.json({
         status: "SUCCESS",
         url: req.url,
         userName: username,
         accessToken: AccessToken,
         expiresIn: ExpiresIn,
         tokenType: TokenType,
         refreshToken: RefreshToken,
         idToken: IdToken,
      });
   } catch (error) {
      const message = error.message ? error.message : "Internal server error";
      // return sendResponse(500, { message })
      res.json({
         status: "FAILED",
         message,
      });
   }
});

app.get("/authToken/*", function (req, res) {
   // Add your code here
   res.json({
      success: "get call succeed!",
      url: req.url,
   });
});

/****************************
 * Example post method *
 ****************************/

app.post("/authToken", function (req, res) {
   // Add your code here
   res.json({
      success: "post call succeed!",
      url: req.url,
      body: req.body,
   });
});

app.post("/authToken/*", function (req, res) {
   // Add your code here
   res.json({
      success: "post call succeed!",
      url: req.url,
      body: req.body,
   });
});

/****************************
 * Example put method *
 ****************************/

app.put("/authToken", function (req, res) {
   // Add your code here
   res.json({
      success: "put call succeed!",
      url: req.url,
      body: req.body,
   });
});

app.put("/authToken/*", function (req, res) {
   // Add your code here
   res.json({
      success: "put call succeed!",
      url: req.url,
      body: req.body,
   });
});

/****************************
 * Example delete method *
 ****************************/

app.delete("/authToken", function (req, res) {
   // Add your code here
   res.json({
      success: "delete call succeed!",
      url: req.url,
   });
});

app.delete("/authToken/*", function (req, res) {
   // Add your code here
   res.json({
      success: "delete call succeed!",
      url: req.url,
   });
});

app.listen(3000, function () {
   console.log("App started");
});

// Export the app object. When executing the application local this does nothing. However,
// to port it to AWS Lambda we will create a wrapper around that will load the app from
// this file
module.exports = app;
