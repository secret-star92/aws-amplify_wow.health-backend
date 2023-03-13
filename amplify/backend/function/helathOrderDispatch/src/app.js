/* Amplify Params - DO NOT EDIT
	API_HEALTHBACKEND_GRAPHQLAPIENDPOINTOUTPUT
	API_HEALTHBACKEND_GRAPHQLAPIIDOUTPUT
	API_HEALTHBACKEND_GRAPHQLAPIKEYOUTPUT
	API_HEALTHBACKEND_ORDERPRODUCTTABLE_ARN
	API_HEALTHBACKEND_ORDERPRODUCTTABLE_NAME
	API_HEALTHBACKEND_ORDERTABLE_ARN
	API_HEALTHBACKEND_ORDERTABLE_NAME
	ENV
	REGION
Amplify Params - DO NOT EDIT */ /*
Copyright 2017 - 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at
    http://aws.amazon.com/apache2.0/
or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and limitations under the License.
*/

const AWS = require("aws-sdk");
const docClient = new AWS.DynamoDB.DocumentClient();
var db = new AWS.DynamoDB();

const express = require("express");
const bodyParser = require("body-parser");
const awsServerlessExpressMiddleware = require("aws-serverless-express/middleware");

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

app.get("/unicommerce/orders/dispatch", function (req, res) {
  // Add your code here
  res.json({ success: "get call succeed!", url: req.url });
});

app.get("/unicommerce/orders/dispatch/*", function (req, res) {
  // Add your code here
  res.json({ success: "get call succeed!", url: req.url });
});

/****************************
 * Example post method *
 ****************************/
async function dispatchOrderItem(id, updatedField) {
  const params = {
    TableName: process.env.API_HEALTHBACKEND_ORDERPRODUCTTABLE_NAME,
    Key: {
      id: id,
    },
    UpdateExpression:
      "set centralGstPercentage = :v1, compensationCessPercentage = :v2, integratedGstPercentage = :v3, stateGstPercentage = :v4 , taxRate = :v5 , unionTerritoryGstPercentage = :v6 ",
    ExpressionAttributeValues: {
      ":v1": updatedField?.centralGstPercentage,
      ":v2": updatedField?.compensationCessPercentage,
      ":v3": updatedField?.integratedGstPercentage,
      ":v4": updatedField?.stateGstPercentage,
      ":v5": updatedField?.taxRate,
      ":v6": updatedField?.unionTerritoryGstPercentage,
    },
    ReturnValues: "UPDATED_NEW",
  };

  console.log(`🚀 ~ file: app.js:74 ~ dispatchOrderItem ~ params:`, params);

  try {
    return await docClient.update(params).promise();
  } catch (error) {
    console.log(`🚀 ~ file: app.js:80 ~ dispatchOrderItem ~ error:`, error);
  }
}

const getOrderProduct = async (id) => {
  const params = {
    TableName: process.env.API_HEALTHBACKEND_ORDERPRODUCTTABLE_NAME,
    Key: { id: id },
  };

  try {
    return await docClient.get(params).promise();
  } catch (error) {
    console.log(`🚀 ~ file: app.js:95 ~ getOrderProduct ~ error:`, error);
  }
};

app.post("/unicommerce/orders/dispatch", async function (req, res) {
  // Add your code here

  let bodyData = req.body;

  let allItemsStatus = [];
  let successStatus = {
    failed: false,
    success: false,
  };

  console.log(`🚀 ~ file: app.js:85 ~ bodyData:`, JSON.stringify(bodyData));

  if (bodyData?.orderItems.length > 0) {
    await Promise.all(
      bodyData?.orderItems.map(async (data, i) => {
        try {
          //check is order exists
          let getItem = await getOrderProduct(data?.orderItemId);

          console.log(`🚀 ~  getItem:`, JSON.stringify(await getItem));

          let isOrderExists = await getItem?.Item?.id;

          console.log(`🚀 ~ isOrderExists:`, isOrderExists);

          if (isOrderExists != undefined) {
            let updateItemResponse = await dispatchOrderItem(
              data?.orderItemId,
              data
            );

            let checkres = JSON.stringify(updateItemResponse);

            console.log("🚀 ~  checkres", checkres);

            successStatus["success"] = true;

          } else {
            // allItemsStatus.push(data?.orderItemId);
            successStatus["failed"] = true;
          }


          //Generating  Response
          const generateCustomResponse = {
            orderItemId: data.orderItemId,
            errorMessage: isOrderExists ? "" : "order Item Id not available",
          };

          allItemsStatus.push(generateCustomResponse);
        } catch (error) {
          console.log(
            "🚀 ~ file: app.js:92 ~ bodyData?.orderItems.map ~ error",
            error
          );
        }
      })
    );
  }
  res.json({
    status:
      successStatus?.success && !successStatus?.failed
        ? "SUCCESS"
        : successStatus?.success && successStatus?.failed
        ? "PARTIAL_SUCCESS"
        : "FAILED",
    orderItems: allItemsStatus,
  });
  // if (allItemsStatus.length === 0) {
  //   res.json({
  //     status: "SUCCESS",
  //     orderItems: bodyData?.orderItems?.map((data) => {
  //       return {
  //         orderItemId: data?.orderItemId,
  //         errorMessage: "",
  //       };
  //     }),
  //   });
  // } else {
  //   res.json({
  //     status: "FAILED",
  //     orderItems: allItemsStatus?.map((item) => {
  //       return {
  //         orderItemId: item,
  //         errorMessage: "item was not found",
  //       };
  //     }),
  //   });
  // }
});

app.post("/unicommerce/orders/dispatch/*", function (req, res) {
  // Add your code here
  res.json({ success: "post call succeed!", url: req.url, body: req.body });
});

/****************************
 * Example put method *
 ****************************/

app.put("/unicommerce/orders/dispatch", function (req, res) {
  // Add your code here
  res.json({ success: "put call succeed!", url: req.url, body: req.body });
});

app.put("/unicommerce/orders/dispatch/*", function (req, res) {
  // Add your code here
  res.json({ success: "put call succeed!", url: req.url, body: req.body });
});

/****************************
 * Example delete method *
 ****************************/

app.delete("/unicommerce/orders/dispatch", function (req, res) {
  // Add your code here
  res.json({ success: "delete call succeed!", url: req.url });
});

app.delete("/unicommerce/orders/dispatch/*", function (req, res) {
  // Add your code here
  res.json({ success: "delete call succeed!", url: req.url });
});

app.listen(3000, function () {
  console.log("App started");
});

// Export the app object. When executing the application local this does nothing. However,
// to port it to AWS Lambda we will create a wrapper around that will load the app from
// this file
module.exports = app;
