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

app.get("/order/ststusnotification", function (req, res) {
  // Add your code here
  res.json({ success: "get call succeed!", url: req.url });
});

app.get("/order/ststusnotification/*", function (req, res) {
  // Add your code here
  res.json({ success: "get call succeed!", url: req.url });
});

/****************************
 * Example post method *
 ****************************/
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
const updateStatusNotification = async (updatedField) => {
  console.log("🚀 ~ file: app.js:69 ~ updateStatusNotification ~ updatedField:", updatedField)
  const params = {
    TableName: process.env.API_HEALTHBACKEND_ORDERPRODUCTTABLE_NAME,
    Key: {
      id: updatedField?.orderItemId,
    },
    UpdateExpression:
      // "set  IsReverse = :v2, courier_status = :v3, updated = :v4  ",
    "set #order_status = :v1, IsReverse = :v2, courier_status = :v3, updated = :v4  ",
    ExpressionAttributeValues: {
      ":v1": updatedField?.status,
      ":v2": updatedField?.IsReverse,
      ":v3": updatedField?.courier_status || "",
      ":v4": updatedField?.updated || "",
    },
    ExpressionAttributeNames: {
      "#order_status": "status"
    },
    ReturnValues: "UPDATED_NEW",
  };
  console.log(
    "🚀 ~ file: app.js:70 ~ updateStatusNotification ~ params:",
    params
  );
  try {
    return docClient.update(params).promise();
  } catch (error) {
    return error;
  }
};
app.post("/order/ststusnotification", async function (req, res) {
  res.json({
    Error: "Send Your Order ID as parameter!!",
    url: req.url,
    body: req.body,
  });
});

app.post("/order/ststusnotification/*", function (req, res) {
  // Add your code here
  res.json({ success: "post call succeed!", url: req.url, body: req.body });
});

app.post("/order/:orderId", async function (req, res) {
  // Add your code here
  let bodyData = req.body;
  let bodyParamOrderID = req.params?.orderId;

  let allItemsStatus = [];
  let successStatus = {
    failed: false,
    success: false,
  };

  console.log(
    `🚀 bodyParamOrderID : ${bodyParamOrderID} and bodyData : `,
    JSON.stringify(bodyData)
  );

  if (bodyData?.orderItems.length > 0) {
    await Promise.all(
      bodyData?.orderItems.map(async (data, i) => {
        try {
          let getItem = await getOrderProduct(data?.orderItemId);

          console.log(`🚀 ~  getItem:`, JSON.stringify(await getItem));

          let isOrderExists = await getItem?.Item?.id;

          console.log(`🚀 ~ isOrderExists:`, isOrderExists);

          if (isOrderExists != undefined) {
            let updateItemResponse = await updateStatusNotification(data);

            console.log(
              `🚀 ~ file: app.js:8 updateItemResponse:`,
              JSON.stringify(await updateItemResponse)
            );

            successStatus["success"] = true;
          } else {
            // allItemsStatus.push(data?.orderItemId);
            successStatus["failed"] = true;
          }

          const generateCustomResponse = {
            orderItemId: data.orderItemId,
            errorMessage: isOrderExists ? "" : "item was not able to update",
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
    error:
      !successStatus?.success && successStatus?.failed
        ? `updated through kartify-orderStatusUpdate Order item id ${bodyParamOrderID} was not able to update`
        : '',
  });
  // if (false) {
  //   res.json({
  //     orderItems: [],
  //     status: "SUCCESS",
  //     error: "",
  //   });
  // } else {
  //   res.json({
  //     status:
  //       successStatus?.success && !successStatus?.failed
  //         ? "SUCCESS"
  //         : // : successStatus?.success && successStatus?.failed
  //           // ? "PARTIAL_SUCCESS"
  //           "FAILED",
  //     orderItems: allItemsStatus,
  //     error: `updated through kartify-orderStatusUpdate Order item id ${bodyParamOrderID} was not able to update`,
  //   });

  //   // res.json({
  //   //   orderItems: [
  //   //     {
  //   //       orderItemId: bodyParamOrderID,
  //   //       errorMessage: "item was not able to update",
  //   //     },
  //   //   ],
  //   //   status: "FAILED",
  //   //   error:
  //   //     ` updated through kartify-orderStatusUpdate Order item id ${bodyParamOrderID} was not able to update`,
  //   // });
  // }
});
/****************************
 * Example put method *
 ****************************/

app.put("/order/ststusnotification", function (req, res) {
  // Add your code here
  res.json({ success: "put call succeed!", url: req.url, body: req.body });
});

app.put("/order/ststusnotification/*", function (req, res) {
  // Add your code here
  res.json({ success: "put call succeed!", url: req.url, body: req.body });
});

/****************************
 * Example delete method *
 ****************************/

app.delete("/order/ststusnotification", function (req, res) {
  // Add your code here
  res.json({ success: "delete call succeed!", url: req.url });
});

app.delete("/order/ststusnotification/*", function (req, res) {
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
